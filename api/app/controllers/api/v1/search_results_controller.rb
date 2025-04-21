# frozen_string_literal: true

module API
  module V1
    # @see Search::Query
    class SearchResultsController < ApplicationController
      record_analytics! do
        record_analytics_for_action :index, event: :search
      end

      def index
        outcome = Search::Query.run(search_options)

        if outcome.valid?
          render_jsonapi outcome.result,
                         include: [:model, :"model.creator", :"model.creators"],
                         serializer: ManifoldSearchConfig.result_serializer,
                         meta: {
                           keyword: search_options[:keyword],
                           pagination: pagination_dict(outcome.result)
                         }
        else
          render_error outcome
        end
      end

      private

      def build_params(options, _collection)
        super.tap do |p|
          p[:search_keyword] = search_params[:keyword]
        end
      end

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
          page_number: page_number,
          per_page: page_size,
          facets: p[:facets],
          project: p[:project].presence,
          text: p[:text].presence,
          text_section: p[:text_section].presence,
        }
      end
    end
  end
end
