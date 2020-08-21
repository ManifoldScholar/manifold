require "uber/inheritable_attr"

module HasFormattedAttributes
  extend ActiveSupport::Concern

  included do
    extend Uber::InheritableAttr unless singleton_class < Uber::InheritableAttr

    inheritable_attr :formatted_attributes

    self.formatted_attributes = Set.new
  end

  class_methods do
    # rubocop:disable Naming/PredicateName

    # @param [<Symbol>] attributes
    # @param [Hash] shared_options
    # @see [.has_formatted_attribute]
    # @return [void]
    def has_formatted_attributes(*attributes, **shared_options)
      attributes.flatten.each do |attribute|
        has_formatted_attribute attribute, **shared_options
      end
    end

    # @param [Symbol] attribute
    # @param [Boolean] include_wrap
    # @return [void]
    def has_formatted_attribute(attribute,
                                include_wrap: true,
                                renderer_options: nil,
                                container: nil)
      options = {
        include_wrap: include_wrap,
        renderer_options: renderer_options,
        container: container
      }
      definition = FormattedAttributes::Definition.new attribute, options

      raise "Already defined formatted_attribute: #{attribute}" unless formatted_attributes.add?(definition)

      include definition.methods_module
    end

    # rubocop:enable Naming/PredicateName
  end
end
