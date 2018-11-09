module Api
  module V1
    # tags controller
    class TagsController < ApplicationController

      resourceful! Tag, authorize_options: { except: [:index] } do
        Tag.filter(tag_filter_params || {})
      end

      def index
        @tags = load_tags
        render_multiple_resources @tags
      end

    end
  end
end
