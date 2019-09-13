module Api
  module V1
    # Projects controller
    class ProjectsController < ApplicationController

      INCLUDES = [
        :creators, :contributors, :texts, :text_categories, :events,
        :resource_collections, :resources, :subjects, :twitter_queries,
        :permitted_users, :content_blocks, :action_callouts
      ].freeze

      resourceful! Project, authorize_options: { except: [:index, :show] } do
        Project.filter(
          with_pagination!(project_filter_params),
          scope: scope_visibility,
          user: current_user
        )
      end

      def index
        @projects = load_projects
        render_multiple_resources @projects, include: %w(creators collaborators)
      end

      def show
        @project = scope_for_projects.find(params[:id])
        authorize_action_for @project
        render_single_resource @project,
                               serializer: ProjectFullSerializer,
                               include: INCLUDES
      end

      def create
        @project = ::Updaters::Project.new(project_params).update(Project.new)
        @project.creator = current_user
        authorize_action_for @project
        Content::ScaffoldProjectContent.run project: @project,
                                            configuration: params.to_unsafe_h.dig(:data, :attributes, :configuration)
        render_single_resource @project
      end

      def update
        @project = load_and_authorize_project
        ::Updaters::Project.new(project_params).update(@project)
        render_single_resource @project,
                               serializer: ProjectFullSerializer,
                               include: INCLUDES
      end

      def destroy
        @project = load_and_authorize_project
        @project.destroy
      end

      protected

      def scope_for_projects
        Project.friendly.includes(
          { texts: [:titles, :text_subjects] },
          :events,
          :twitter_queries,
          :text_categories,
          :subjects
        )
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
