require "uber/inheritable_attr"

module Concerns
  module HasFormattedAttributes
    extend ActiveSupport::Concern

    included do
      extend Uber::InheritableAttr unless singleton_class < Uber::InheritableAttr

      inheritable_attr :formatted_attributes

      self.formatted_attributes = Set.new
    end

    class_methods do
      # rubocop:disable Style/PredicateName

      # @param [<Symbol>] attributes
      # @param [Hash] shared_options
      # @see [.has_formatted_attribute]
      # @return [void]
      def has_formatted_attributes(*attributes, **shared_options)
        attributes.each do |attribute|
          has_formatted_attribute attribute, **shared_options
        end
      end

      # @param [Symbol] attribute
      # @param [Boolean] include_wrap
      # @return [void]
      def has_formatted_attribute(attribute, include_wrap: true, renderer_options: nil)
        options = { include_wrap: include_wrap, renderer_options: renderer_options }
        definition = FormattedAttributes::Definition.new attribute, options

        unless formatted_attributes.add?(definition)
          raise "Already defined formatted_attribute: #{attribute}"
        end

        include definition.methods_module
      end

      # rubocop:enable Style/PredicateName
    end
  end
end
