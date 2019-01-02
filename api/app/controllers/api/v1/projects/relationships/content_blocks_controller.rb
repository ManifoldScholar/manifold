module Api
  module V1
    module Projects
      module Relationships
        class ContentBlocksController < ApplicationController

          before_action :set_project, only: [:index, :create]

          resourceful! ContentBlock, authorize_options: { except: [:index] } do
            @project.content_blocks
          end

          # TODO: Is this OK or should we refactor resourceful! to determine
          # each_serializer based on each model instead of config?
          def index
            @content_blocks = @project.content_blocks
            render json: @content_blocks, location: location
          end

          def create
            @content_block = @project.content_blocks.new(type: params.dig(:data,
                                                                          :attributes,
                                                                          :type))
            @content_block = ::Updaters::ContentBlock.new(permitted_params)
                                                     .update(@content_block)
            @content_block.save
            authorize_action_for @content_block

            render_single_resource @content_block, location: location
          end

          private

          def set_project
            @project = Project.friendly.find(params[:project_id])
          end

          def location
            api_v1_project_relationships_content_blocks_url(
              @content_block,
              project_id: @project.id
            )
          end

          def permitted_params
            content_block_params
          end
        end
      end
    end
  end
end
