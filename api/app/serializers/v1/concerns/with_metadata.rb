module V1
  module Concerns
    module WithMetadata
      extend ActiveSupport::Concern

      class_methods do
        def with_metadata(metadata: true, formatted: true, properties: true)
          include_metadata_attribute(:metadata) if metadata
          include_metadata_attribute(:metadata_formatted) if formatted
          include_metadata_properties if properties
        end

        def with_metadata_if_full(metadata: true, formatted: true, properties: true)
          include_metadata_attribute(:metadata, true) if metadata
          include_metadata_attribute(:metadata_formatted, true) if formatted
          include_metadata_properties(true) if properties
        end

        def include_metadata_properties(if_full = false)
          options = {}
          options[:if] = if_full_proc if if_full
          attributes :metadata_properties, options, &:camelized_metadata_properties
        end

        def include_metadata_attribute(key, if_full = false)
          options = {}
          options[:if] = if_full_proc if if_full

          attributes(key, options) do |object|
            value = object.send(key)
            next value unless value.respond_to?(:key?)

            camelize_hash(value)
          end
        end
      end
    end
  end
end
