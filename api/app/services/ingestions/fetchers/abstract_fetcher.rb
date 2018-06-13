module Ingestions
  module Fetchers
    # @abstract
    class AbstractFetcher < Ingestions::AbstractInteraction
      define_model_callbacks :fetchability_check, :perform

      string :url, default: nil

      boolean :test_only, default: false

      def execute
        run_callbacks :fetchability_check do
          @fetchable = determine_fetchability
        end

        return fetchable? if test_only
        return nil unless fetchable?

        run_callbacks :perform do
          @manifest = perform
        end

        manifest
      end

      def fetchable?
        @fetchable
      end

      attr_reader :manifest

      # @abstract
      # @return [Boolean]
      def determine_fetchability
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @return [Manifest]
      def perform
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end
    end
  end
end
