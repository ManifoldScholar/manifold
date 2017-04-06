module Api
  module V1
    # Projects controller
    class ProjectsController < ApplicationController

      INCLUDES = [
        :creators, :contributors, :texts, :text_categories, :events,
        :collections, :uncollected_resources
      ].freeze

      resourceful! Project, authorize_options: { except: [:index, :show] } do
        Project.filter(
          with_pagination!(project_filter_params),
          scope: Project.includes(:makers, :creators, :contributors)
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
        @scope_for_projects = Project.friendly
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
        Project.includes(:creators, :contributors, { texts: :text_sections },
                         :text_categories, :events, :collections,
                         resources: :collection_resources).friendly
      end

    end
  end
end
