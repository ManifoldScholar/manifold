module Ingestions
  module Fetchers
    # @abstract
    class AbstractFetcher < ActiveInteraction::Base
      include Ingestions::Concerns::CatchesExceptions

      define_model_callbacks :fetchability_check, :perform
      string :url
      boolean :test_only, default: false

      attr_reader :tempfile

      def execute
        run_callbacks :fetchability_check do
          @fetchable = determine_fetchability
        end

        return fetchable? if test_only
        return nil unless fetchable?

        run_callbacks :perform do
          @tempfile = perform
        end

        @tempfile
      end

      def fetchable?
        @fetchable
      end

      # @abstract
      # @return [Boolean]
      def determine_fetchability
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @return [Manifest]
      def perform
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      protected

      def tmp_pointer(name, ext)
        Tempfile.new([name, ".#{ext}"])
      end

    end
  end
end
