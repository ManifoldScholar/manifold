module API
  module V1
    module ProjectCollections
      module Relationships
        class CollectionProjectsController < ApplicationController

          before_action :set_project_collection

          resourceful! CollectionProject,
                       authorize_options: { except: [:index, :show] } do
            @project_collection.collection_projects.projects_with_read_ability(current_user)
              .includes(includes)
          end

          def index
            @collection_projects = load_collection_projects
            render_multiple_resources(
              @collection_projects,
              location: location,
              include: [:project]
            )
          end

          def create
            @collection_project = ::Updaters::Default.new(collection_project_params)
              .update(@project_collection.collection_projects.new)
            @collection_project.save
            authorize_action_for @collection_project
            render_single_resource @collection_project, location: location
          end

          def destroy
            @collection_project = load_and_authorize_collection_project
            @collection_project.destroy
          end

          def update
            @collection_project = load_and_authorize_collection_project
            ::Updaters::Default.new(collection_project_params).update(@collection_project)
            render_single_resource(@collection_project,
                                   location: location)
          end

          private

          def set_project_collection
            @project_collection = ProjectCollection.friendly
              .find(params[:project_collection_id])
          end

          def location
            api_v1_project_collection_relationships_collection_projects_url(@project_collection)
          end

          def includes
            %w()
          end

        end
      end
    end
  end
end
