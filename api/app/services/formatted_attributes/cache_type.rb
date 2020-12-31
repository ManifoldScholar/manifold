module FormattedAttributes
  # @abstract
  class CacheType
    include StoreModel::Model

    delegate :configuration, to: :class

    # @return [HasFormattedAttributes, nil]
    def model
      parent if parent.is_a?(HasFormattedAttributes)
    end

    # @see FormattedAttributes::FormattedAttributeType#refresh!
    # @return [void]
    def refresh_all!
      each_defined_attribute(&:refresh!)
    end

    def fetch(needle)
      definition = configuration.fetch needle

      public_send definition.key
    end

    alias [] fetch

    # @api private
    # @yield [attribute]
    # @yieldparam [FormattedAttributes::FormattedAttributeType] attribute
    # @yieldreturn [void]
    # @return [void]
    def each_defined_attribute
      return enum_for(__method__) unless block_given?

      configuration.each do |definition|
        attribute = public_send definition.key

        yield attribute
      end

      return self
    end

    class << self
      attr_accessor :configuration

      # @api private
      def inherit_for!(configuration)
        kls = Class.new self

        kls.configuration = configuration

        configuration.model.const_set :FACacheType, kls

        return kls
      end
    end
  end
end
