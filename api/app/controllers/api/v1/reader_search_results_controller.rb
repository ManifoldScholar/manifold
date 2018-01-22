module Api
  module V1
    # ReaderSearchResultsController
    class ReaderSearchResultsController < ApplicationController

      def index
        outcome = Search::Reader.run(search_options)
        if outcome.valid?
          serializer = reader_search_params[:raw] ? nil : ReaderSearchResultSerializer
          render json: outcome.result,
                 each_serializer: serializer,
                 include: [:creator, :text_section, :annotation],
                 meta: { pagination: pagination_dict(outcome.result) }
        else
          render_error(outcome)
        end
      end

      private

      def render_error
        options = {
          status: 500,
          title: "Manifold encountered an error",
          detail: outcome.errors.full_messages.join("; ")
        }
        render json: { errors: build_api_error(options) }, status: 500
      end

      def search_options
        valid_params = reader_search_params
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
