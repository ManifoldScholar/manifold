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
        valid_params = search_params
        {
          keyword: valid_params[:keyword],
          page_number: valid_params.dig(:page, :number),
          facets: valid_params[:facets],
          project: valid_params[:project],
          text: valid_params[:text],
          text_section: valid_params[:text_section]
        }
      end

    end
  end
end
