module Api
  module V1
    class ProjectExportationsController < ApplicationController
      resourceful! ProjectExportation do
        ProjectExportation.all
      end

      def index
        @project_exportations = load_project_exportations

        render_multiple_resources @project_exportations
      end

      def show
        @project_exportation = load_and_authorize_project_exportation

        render_single_resource @project_exportation
      end

      def create
        @project_exportation = ProjectExportations::CreateFromAPI.run! project_exportation_params

        render_single_resource @project_exportation
      end
    end
  end
end
