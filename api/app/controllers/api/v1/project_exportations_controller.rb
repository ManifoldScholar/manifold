module API
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

      def destroy
        @project_exportation = load_and_authorize_project_exportation
        @project_exportation.destroy
      end

      def create
        @project_exportation = ProjectExportations::CreateFromAPI.run project_exportation_params
        if @project_exportation.valid?
          resource = @project_exportation.result
        else
          @project_exportation.result.clear
          @project_exportation.result.add :base, I18n.t("controllers.errors.project_exportation.failed")
          resource = @project_exportation
        end
        render_single_resource resource, serializer: ::V1::ProjectExportationSerializer
      end
    end
  end
end
