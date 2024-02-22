# frozen_string_literal: true

module SettingSections
  module Serialization
    extend ActiveSupport::Concern

    module ClassMethods
      # Define a typed attribute that serializes the section
      # using optional redaction and additional exposures on
      # derived attributes for the given section.
      #
      # @param [Symbol] name
      # @param [Dry::Types::Type] type
      # @return [void]
      def typed_section_attribute(name, type)
        typed_attribute(name, type) do |object, _params|
          object.public_send(name).to_serialized_response
        end
      end
    end
  end
end
