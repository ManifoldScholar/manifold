module Api
  module V1
    # SearchResultsController
    class SearchResultsController < ApplicationController

      def index
        outcome = Search::Query.run(search_options)
        if outcome.valid?
          serializer = search_params[:raw] ? nil : SearchResultSerializer
          render json: outcome.result,
                 each_serializer: serializer,
                 include: [model: [:creators, :creator]],
                 meta: {
                   keyword: search_options.dig(:keyword),
                   pagination: pagination_dict(outcome.result)
                 }
        else
          render_error outcome
        end
      end

      private

      def render_error(outcome)
        options = {
          status: 500,
          title: "Manifold encountered an error",
          detail: outcome.errors.full_messages.join("; ")
        }
        render json: { errors: build_api_error(options) }, status: :internal_server_error
      end

      def search_options
        p = search_params
        {
          keyword: p[:keyword],
          page_number: p.dig(:page, :number),
          facets: p[:facets],
          project: p[:project].presence || p[:project],
          text: p[:text].presence || p[:text],
          text_section: p[:text_section].presence || p[:text_section]
        }
      end

    end
  end
end
