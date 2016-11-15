module Api
  module V1
    module Projects
      module Relationships
        # Responds with uncollected in a project
        class UncollectedResourcesController < ApplicationController
          before_action :set_project, only: [:index]

          # GET /resources
          def index
            @resources = @project.uncollected_resources
                                 .filtered(resource_filter_params[:filter])
                                 .page(page_number)
                                 .per(page_size)
            render json: @resources,
                   each_serializer: ResourceSerializer,
                   meta: { pagination: pagination_dict(@resources) }
          end

          private

          def set_project
            @project = Project.find(params[:project_id])
          end

        end
      end
    end
  end
end
