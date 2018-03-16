module Api
  module V1
    module Projects
      module Relationships
        # Imports resources into a project
        class ResourceImportsController < ApplicationController

          before_action :set_project

          resourceful! ResourceImport do
            @project.resource_imports
          end

          def show
            @resource_import = load_resource_import
            render_single_resource(
              @resource_import,
              location: resource_import_location
            )
          end

          def create
            updater = ::Updaters::ResourceImport.new(resource_import_params)
            @resource_import = updater.update(
              @project.resource_imports.new, creator: @current_user
            )
            authorize_action_for @resource_import
            render_single_resource @resource_import, location: resource_import_location
          end

          def update
            @resource_import = load_and_authorize_resource_import
            ::Updaters::ResourceImport.new(resource_import_params)
                                      .update(@resource_import)

            render_single_resource @resource_import, location: resource_import_location
          end

          private

          def resource_import_location
            api_v1_project_relationships_resource_imports_url(
              @resource_import,
              project_id: @project.id
            )
          end

          def set_project
            @project = Project.friendly.find(params[:project_id])
          end
        end
      end
    end
  end
end
