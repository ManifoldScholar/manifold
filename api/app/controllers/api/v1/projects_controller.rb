module API
  module V1
    # Projects controller
    class ProjectsController < ApplicationController

      resourceful! Project, authorize_options: { except: [:index, :show] } do
        Project.filtered(
          with_pagination!(project_filter_params&.with_defaults(no_issues: true)),
          scope: scope_visibility.includes(:creators),
          user: current_user
        )
      end

      def index
        @projects = load_projects
        render_multiple_resources @projects, include: [:creators]
      end

      def show
        @project = scope_for_projects.find(params[:id])
        authorize_action_for @project
        render_single_resource @project, include: includes, params: { include_toc: @project.texts_in_toc_blocks_ids }
      end

      def create
        @project = ::Updaters::Project.new(project_params).update(Project.new(creator: current_user))
        authorize_action_for @project
        Content::ScaffoldProjectContent.run project: @project,
                                            configuration: params.to_unsafe_h.dig(:data, :attributes, :configuration)
        render_single_resource @project
      end

      def update
        @project = load_and_authorize_project
        ::Updaters::Project.new(project_params).update(@project)
        render_single_resource @project,
                               include: includes
      end

      def destroy
        @project = load_and_authorize_project
        @project.destroy
      end

      protected

      def includes
        [:creators, :contributors, :texts, :text_categories, :events,
         :resource_collections, :resources, :subjects, :twitter_queries,
         :permitted_users, :content_blocks, :action_callouts, :journal,
         :journal_volume, :journal_issue]
      end

      def scope_for_projects
        Project.friendly
      end

      def scope_visibility
        # The default scope is to return all projects that can be read by the current
        # user, which as of now includes all projects except for drafts. If
        # the API is asked to return projects that can be updated by the current user
        # (such as for a backend dashboard), we do not apply the read check. We could
        # apply both the read and update scopes, but then we have to join roles on both
        # which I suspect is less efficient. Note that the with_update_ability is applied
        # automatically through the filterable concern. -ZD
        return Project.with_read_ability current_user unless project_filter_params&.dig(:with_update_ability)

        Project.all
      end

    end
  end
end
