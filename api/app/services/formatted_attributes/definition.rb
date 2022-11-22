module FormattedAttributes
  class Definition
    extend Dry::Initializer
    extend Memoist

    include Equalizer.new(:path)
    include Sliceable

    param :attribute, type: Types::Coercible::Symbol

    option :container, type: Types::Coercible::Symbol, optional: true

    option :include_wrap, Types::Bool, default: proc { true }

    option :renderer_options, default: proc { {} } do
      option :filter_html, Types::Bool, default: proc { true }
      option :no_images, Types::Bool, default: proc { true }
      option :no_links, Types::Bool, default: proc { false }
      option :no_styles, Types::Bool, default: proc { true }
      option :hard_wrap, Types::Bool, default: proc { true }
    end

    # @return [String]
    attr_reader :attribute_name

    # @return [Class]
    attr_reader :cache_type

    # @return [<Symbol>]
    attr_reader :derived_method_names

    # @return [Symbol]
    attr_reader :key

    # @return [Module]
    attr_reader :methods_module

    # @return [String]
    attr_reader :path

    def initialize(*)
      super

      derive_attributes!
    end

    # @param [HasFormattedAttributes] model
    # @return [String, nil]
    def extract_raw_from(model)
      container_or_model = has_container? ? model&.public_send(container) : model

      if container_or_model.blank?
        nil
      elsif container_or_model.respond_to?(attribute)
        container_or_model.public_send(attribute)
      elsif container_or_model.respond_to?(:dig)
        container_or_model.dig(attribute)
      elsif container_or_model.respond_to?(:[])
        container_or_model[attribute]
      else
        # :nocov:
        raise FormattedAttributes::InvalidModel, "Don't know how to get #{attribute.inspect} from #{container_or_model.inspect}"
        # :nocov:
      end
    end

    def has_container?
      container.present?
    end

    def include_wrap?
      include_wrap.present?
    end

    def match?(needle)
      case needle
      when Symbol
        key == needle
      when /\A\w+\.\w+\z/
        path == needle
      else
        attribute_name == needle
      end
    end

    # @return [{ Symbol => Object }]
    def options
      slice(:container, :include_wrap, :renderer_options).compact.transform_values(&:as_json)
    end

    # @param [HasFormattedAttributes] model
    def should_recalculate?(model)
      return true if model.new_record?

      if has_container?
        model.will_save_change_to_attribute? container
      else
        model.will_save_change_to_attribute? attribute
      end
    end

    # @group Transformations

    # @param [String] value
    # @return [String]
    def format(value)
      SimpleFormatter.run!(input: value, include_wrap: include_wrap?, renderer_options: renderer_options.as_json)
    end

    # @param [String] value
    # @return [String]
    def textify(value)
      Rails::Html::FullSanitizer.new.sanitize value
    end

    # @endgroup

    private

    # @return [void]
    def derive_attributes!
      @path = [container, attribute].select(&:present?).join(".").freeze

      @attribute_name = attribute.to_s.freeze

      @key = @path.gsub(/\./, "__").to_sym.freeze

      @methods_module = FormattedAttributes::Methods.new(self)

      @derived_method_names = @methods_module.method_names.values.map(&:to_sym).freeze

      @cache_type = FormattedAttributes::FormattedAttributeType.inherit_for! self
    end

    # @param [FormattedAttributes::Definition] orig
    def initialize_copy(orig)
      initialize orig.attribute, **orig.options
    end
  end
end
