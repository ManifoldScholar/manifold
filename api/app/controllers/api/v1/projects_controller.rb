module Api
  module V1
    # Projects controller
    class ProjectsController < ApplicationController

      INCLUDES = [
        :creators, :contributors, :texts, :text_categories, :events,
        :collections, :uncollected_resources, :subjects, :twitter_queries,
        :permitted_users
      ].freeze

      resourceful! Project, authorize_options: { except: [:index, :show] } do
        includes = [
          { texts: [:titles, :text_subjects] },
          { collections: [] },
          { events: [] },
          { resources: [:tags] }
        ]

        Project.filter(
          with_pagination!(project_filter_params),
          scope: scope_visibility.includes(includes),
          user: current_user
        )
      end

      def index
        @projects = load_projects
        render_multiple_resources(
          @projects,
          include: %w(creators collaborators),
          each_serializer: ProjectPartialSerializer
        )
      end

      def show
        @scope_for_projects = Project.friendly.includes(
          { texts: [:titles, :text_subjects] },
          { collections: { resources: :tags } },
          :events,
          resources: :tags
        )
        @project = load_project
        render_single_resource(@project, include: INCLUDES)
      end

      def create
        @project = authorize_and_create_project(project_params)
        render_single_resource @project
      end

      def update
        @project = load_and_authorize_project
        ::Updaters::Project.new(project_params).update(@project)
        render_single_resource(@project, include: INCLUDES)
      end

      def destroy
        @project = load_and_authorize_project
        @project.destroy
      end

      protected

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
        unless project_filter_params&.dig(:with_update_ability)
          return Project.with_read_ability current_user
        end
        Project.all
      end

    end
  end
end
