module FormattedAttributes
  class FormattedAttributeType
    include StoreModel::Model

    attribute :formatted, :string, default: ""
    attribute :plaintext, :string, default: ""

    delegate :definition, to: :class

    # @see FormattedAttributes::CacheType#model
    # @return [HasFormattedAttributes, nil]
    def model
      return nil unless parent.is_a?(FormattedAttributes::CacheType)

      parent.model
    end

    # The actual value on the model
    #
    # @return [String, nil]
    def raw
      definition.extract_raw_from model
    end

    # @return [void]
    def format!
      self.formatted = definition.format raw
    end

    # @return [void]
    def textify!
      self.plaintext = definition.textify formatted
    end

    # @see #format!
    # @see #textify!
    # @return [void]
    def refresh!
      format!

      textify!
    end

    class << self
      attr_accessor :definition

      def inherit_for!(definition)
        Class.new(self).tap do |kls|
          kls.definition = definition
        end
      end

      def name
        return "FormattedAttributes::FormattedAttributeType" unless definition.present?

        "FormattedAttributes::FormattedAttributeType[:#{definition.key}]"
      end
    end
  end
end
