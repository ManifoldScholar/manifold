module Ingestions
  module Strategies
    class Manifest < Ingestions::Strategies::AbstractStrategy

      def perform; end

      def determine_ingestibility
        context.ingestion_path_for_file("source/manifest", %w(yml yaml)).present?
      end
    end
  end
end
