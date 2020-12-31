module FormattedAttributes
  class Configuration
    include Enumerable

    # @api private
    # @return [Set<FormattedAttributes::Definition>]
    attr_reader :definitions

    # @api private
    # An {ApplicationModel} that includes {HasFormattedAttributes}
    # @return [Class]
    attr_reader :model

    delegate :each, :length, :size, to: :@definitions

    def initialize(model:)
      @model = model
      @definitions = Set.new
      @cache_type  = FormattedAttributes::CacheType.inherit_for! self
    end

    # @param [Symbol] attribute
    # @param [Hash] options
    # @return [void]
    def define!(attribute, **options)
      definition = FormattedAttributes::Definition.new(attribute, options)

      add! definition

      nil
    end

    # @param [FormattedAttributes::Definition] definition
    # @return [FormattedAttributes::Configuration]
    def <<(definition)
      add! definition

      self
    end

    def fetch(needle)
      found = nil

      each do |definition|
        next unless definition.match? needle

        raise AmbiguousNeedle, "Ambiguous needle: #{needle.inspect}" if found

        found = definition
      end

      raise UnknownDefinition, "Could not find formatted attribute definition with: #{needle.inspect}" unless found

      found
    end

    alias [] fetch

    def include?(needle)
      fetch(needle).present?
    rescue UnknownDefinition
      false
    end

    # @return [<Symbol>]
    def derived_method_names
      flat_map(&:derived_method_names)
    end

    # @return [<Symbol>]
    def keys
      map(&:key)
    end

    # @return [<String>]
    def paths
      map(&:path)
    end

    # @api private
    # @param [HasFormattedAttributes] model
    def should_recalculate?(model)
      any? do |definition|
        definition.should_recalculate? model
      end
    end

    # @api private
    # @return [void]
    def add_cache_type_attribute!
      @model.attribute :fa_cache, @cache_type.to_type, default: {}
    end

    # @api private
    # @see HasFormattedAttributes::ClassMethods#inherited
    # @param [Class] subclass
    # @return [FormattedAttributes::Configuration]
    def clone_for(subclass)
      Configuration.new(model: subclass).tap do |child|
        each do |definition|
          child << definition.clone
        end
      end
    end

    private

    # @param [FormattedAttributes::Definition] definition
    # @return [void]
    def add!(definition)
      raise TypeError, "Must be a definition: #{definition.class}" unless definition.is_a?(FormattedAttributes::Definition)
      raise FormattedAttributes::AlreadyDefinedError, "Already defined #{definition.path.inspect}" unless @definitions.add?(definition)

      model.include definition.methods_module

      @cache_type.attribute definition.key, definition.cache_type.to_type, default: {}
    end
  end
end
