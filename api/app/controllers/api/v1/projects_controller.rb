module Api
  module V1
    # Projects controller
    class ProjectsController < ApplicationController

      INCLUDES = %w(
        creators contributors texts text_categories events collections
        uncollected_resources
      ).freeze

      resourceful! Project, authorize_options: { except: [:index, :show] } do
        Project
          .includes(:makers, :creators, :contributors)
          .filtered(project_filter_params[:filter])
          .page(page_number)
          .per(page_size)
      end

      def index
        @projects = load_projects
        render_multiple_resources(
          @projects, include: %w(creators collaborators),
                     each_serializer: ProjectPartialSerializer
        )
      end

      def show
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

    end
  end
end
