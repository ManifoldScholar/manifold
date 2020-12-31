module FormattedAttributes
  # This class derives and defines a number of methods that get included
  # directly on a model that uses {HasFormattedAttributes.has_formatted_attribute}.
  #
  # @api private
  class Methods < Module
    extend Memoist

    include Dry::Initializer.define -> do
      param :definition, Types.Instance(FormattedAttributes::Definition)
    end

    METHOD_NAMES = {
      formatted: "%<attribute>s_formatted",
      plaintext: "%<attribute>s_plaintext",
      refresh: "refresh_formatted_%<attribute>s",
      update_db_cache: "update_db_cache_for_formatted_%<attribute>s"
    }.freeze

    delegate :attribute, :key, :path, to: :definition

    def initialize(*)
      super

      initialize_methods!
    end

    # @!attribute [r] attribute_cache
    # Path to the attribute cache for this specific attribute.
    # @return [String]
    memoize def attribute_cache
      "fa_cache.#{key}"
    end

    # @return [String]
    def inspect
      # :nocov:
      "#<FormattedAttributes::Methods.for(#{path.inspect})>"
      # :nocov:
    end

    # @param [Symbol] key
    # @return [String]
    def method_name(key)
      method_names.fetch(key)
    end

    # @!attribute [r] method_names
    # @return [{ Symbol => String }]
    memoize def method_names
      params = { attribute: attribute }

      METHOD_NAMES.transform_values do |value|
        value % params
      end.freeze
    end

    private

    # @return [void]
    def initialize_methods!
      class_eval <<~RUBY, __FILE__, __LINE__ + 1
        def #{method_name(:formatted)}            # def title_formatted
          #{attribute_cache}.formatted            #   fa_cache.title.formatted
        end                                       # end

        def #{method_name(:plaintext)}            # def title_plaintext
          #{attribute_cache}.plaintext            #   fa_cache.title.plaintext
        end                                       # end

        def #{method_name(:refresh)}              # def refresh_formatted_title
          #{attribute_cache}.refresh!             #   fa_cache.title.refresh!
                                                  #
          maybe_save_formatted_attributes_cache!  #   maybe_save_formatted_attributes_cache!
        end                                       # end

        def #{method_name(:update_db_cache)}      # def update_db_cache_for_formatted_title
          #{attribute_cache}.refresh!             #   fa_cache.title.refresh!
        end                                       # end
      RUBY
    end
  end
end
