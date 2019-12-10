module Packaging
  module Preservation
    class ExportProjectMetadata < ActiveInteraction::Base
      extend Memoist

      record :project

      # @api private
      UNSET = Dux.null_object("UNSET", purpose: "For when no value is provided")

      # @return [ActiveSupport::HashWithIndifferentAccess]
      def execute
        store :id
        store :reader_url, frontend_path("projects/#{project.slug}")
        store :title, :title_plaintext
        store :description
        store :metadata
      end

      private

      # @param [String] path
      # @return [String]
      def frontend_path(path)
        URI.join(frontend_url, path).to_s
      end

      memoize def frontend_url
        Rails.configuration.manifold.url
      end

      # @!attribute [r] metadata
      # @return [ActiveSupport::HashWithIndifferentAccess]
      memoize def metadata
        {}.with_indifferent_access
      end

      # @param [#to_s] key
      # @param [Symbol, #to_json, nil] value
      # @yieldreturn [#to_json]
      # @return [ActiveSupport::HashWithIndifferentAccess]
      def store(key, value = UNSET, &block)
        metadata[key] = read_value(key, value, &block)

        return metadata
      end

      # @param [#to_s] key
      # @param [#to_s] key
      # @param [Symbol, #to_json, nil] value
      # @yieldreturn [#to_json]
      # @return [#to_json]
      def read_value(key, value = nil)
        if value == UNSET
          block_given? ? yield(project) : project[key]
        elsif block_given?
          raise ArgumentError, "cannot provide #{value.inspect} and a block"
        elsif value.kind_of?(Symbol) && project.respond_to?(value)
          project[value]
        else
          value.as_json
        end
      end
    end
  end
end
