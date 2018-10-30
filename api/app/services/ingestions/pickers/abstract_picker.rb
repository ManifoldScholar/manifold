module Ingestions
  module Pickers
    class AbstractPicker < AbstractInteraction
      string :source_path, default: nil

      def execute
        found = Ingestions.__send__(self.class.registry).detect do |definition|
          compose definition.interaction, test_only: true
        end

        found || none_found_error
      end

      private

      def none_found_error
        raise IngestionError,
              "No #{self.class.klass_name} found for #{interaction_source_path}"
      end

      def interaction_source_path
        source_path || context.source_root
      end

      class << self
        def klass_name
          name.demodulize
        end

        def registry
          klass_name.pluralize.underscore
        end
      end

    end
  end
end
