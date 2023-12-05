module API
  module V1
    # tags controller
    class TagsController < ApplicationController

      resourceful! Tag, authorize_options: { except: [:index] } do
        Tag.filtered(with_pagination!(tag_filter_params || {}))
      end

      def index
        @tags = load_tags
        render_multiple_resources @tags, serializer: ::V1::TagSerializer
      end
    end
  end
end
