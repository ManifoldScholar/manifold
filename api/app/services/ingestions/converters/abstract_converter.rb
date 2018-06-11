module Ingestions
  module Converters
    # @abstract
    class AbstractConverter < Ingestions::AbstractInteraction
      define_model_callbacks :convertibility_check, :perform

      string :contents, default: nil
      string :source_path, default: nil

      boolean :test_only, default: false

      def execute
        run_callbacks :convertibility_check do
          @convertible = determine_convertibility
        end

        return convertible? if test_only
        return nil unless convertible?

        run_callbacks :perform do
          @manifest = perform
        end

        manifest
      end

      def convertible?
        @convertible
      end

      attr_reader :manifest

      # @abstract
      # @return [Boolean]
      def determine_convertibility
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @return [Manifest]
      def perform
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end
    end
  end
end
