# frozen_string_literal: true

module Filtering
  class SortMapping < ::Types::FlexibleStruct
    DIRS = Filtering::Types::SortDirection.values.freeze

    attribute :key, Filtering::Types::Coercible::String
    attribute :property, Filtering::Types::Coercible::String
    attribute :direction, Filtering::Types::SortDirection

    alias dir direction

    class << self
      # @param [<String>] properties
      # @return [ActiveSupport::HashWithIndifferentAccess{ String => Filtering::SortMapping }]
      def from(*properties)
        properties.flatten!

        properties.product(DIRS).each_with_object({}.with_indifferent_access) do |(property, direction), h|
          key = "#{property}_#{direction}"

          mapping = Filtering::SortMapping.new(key: key, property: property, direction: direction)

          h[key] = mapping
        end.freeze
      end
    end
  end
end
