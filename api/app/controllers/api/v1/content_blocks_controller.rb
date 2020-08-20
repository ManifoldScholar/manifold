module API
  module V1
    # ContentBlocks controller
    class ContentBlocksController < ApplicationController

      resourceful! ContentBlock

      def show
        @content_block = load_and_authorize_content_block
        render_single_resource @content_block,
                               serializer: serializer,
                               location: location
      end

      def update
        @content_block = load_and_authorize_content_block
        ::Updaters::ContentBlock.new(permitted_params).update(@content_block)
        render_single_resource @content_block,
                               serializer: serializer,
                               location: location
      end

      def destroy
        @content_block = load_and_authorize_content_block
        @content_block.destroy
      end

      private

      def permitted_params
        content_block_params @content_block.type
      end

      def location
        api_v1_content_block_path @content_block.type
      end

      def serializer
        @content_block.serializer
      end
    end
  end
end
