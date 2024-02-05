# frozen_string_literal: true

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
        store :reader_url, compose(Projects::GetReaderURL, inputs)
        store :title, :title_plaintext
        store :slug
        store :description
        store :publication_date
        store :created_at
        store :updated_at
        store :metadata
        store :collaborators, :collaborator_packaging_metadata
        store :text_ids
        store :resource_ids
      end

      private

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
          block_given? ? yield(project) : project.public_send(key)
        elsif block_given?
          raise ArgumentError, "cannot provide #{value.inspect} and a block"
        elsif value.is_a?(Symbol) && project.respond_to?(value)
          project.public_send value
        else
          value.as_json
        end
      end
    end
  end
end
