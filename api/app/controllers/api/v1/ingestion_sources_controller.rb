module API
  module V1
    class IngestionSourcesController < ApplicationController

      resourceful! IngestionSource, authorize_options: { except: [:show] }

      def show
        @ingestion_source = load_ingestion_source
        authorize_action_for @ingestion_source.text

        render_single_resource @ingestion_source
      end

      def update
        @ingestion_source = load_and_authorize_ingestion_source
        ::Updaters::IngestionSource.new(ingestion_source_params).update(
          @ingestion_source
        )

        render_single_resource @ingestion_source, context: :from_api
      end

      def destroy
        @ingestion_source = load_ingestion_source
        @ingestion_source&.destroy
      end
    end
  end
end
