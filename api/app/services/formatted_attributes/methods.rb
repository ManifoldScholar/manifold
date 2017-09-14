module FormattedAttributes
  class Methods < Module
    attr_reader :definition

    delegate :attribute, :include_wrap?, to: :definition
    delegate :attribute, :renderer_options, to: :definition

    def initialize(definition)
      @definition = definition

      @method_names = {
        formatted_cache_key: :"cache_key_for_formatted_#{attribute}",
        plaintext_cache_key: :"cache_key_for_plaintext_#{attribute}",
        format: :"format_#{attribute}",
        formatted: :"#{attribute}_formatted",
        plaintext: :"#{attribute}_plaintext",
        refresh: :"refresh_formatted_#{attribute}",
        textify: :"textify_#{attribute}"
      }

      initialize_methods!
    end

    def method_name(key)
      @method_names.fetch(key)
    end

    private

    # rubocop:disable Metrics/AbcSize
    def initialize_methods!
      class_eval <<-RUBY, __FILE__, __LINE__ + 1
          extend ActiveSupport::Concern

          included do
            after_save :#{method_name(:refresh)}, if: :#{attribute}_changed?
          end

          def #{method_name(:formatted)}
            if persisted?
              Rails.cache.fetch(#{method_name(:formatted_cache_key)}) do
                #{method_name(:format)}
              end
            else
              #{method_name(:format)}
            end
          end

          def #{method_name(:plaintext)}
            if persisted?
              Rails.cache.fetch #{method_name(:plaintext_cache_key)} do
                #{method_name(:textify)}
              end
            else
              #{method_name(:textify)}
            end
          end

          def #{method_name(:format)}
            SimpleFormatter.run!(
              input: #{attribute},
              include_wrap: #{include_wrap?},
              renderer_options: #{renderer_options}
            )
          end

          def #{method_name(:textify)}
            Rails::Html::FullSanitizer.new.sanitize #{method_name(:formatted)}
          end

          def #{method_name(:refresh)}
            Rails.cache.write(#{method_name(:formatted_cache_key)}, #{method_name(:format)})
            Rails.cache.write(#{method_name(:plaintext_cache_key)}, #{method_name(:textify)})
          end

          private

          def #{method_name(:formatted_cache_key)}
            "\#{model_name.cache_key}/\#{id}/formatted/#{attribute}"
          end

          def #{method_name(:plaintext_cache_key)}
            "\#{model_name.cache_key}/\#{id}/plaintext/#{attribute}"
          end
      RUBY
    end
    # rubocop:enable Metrics/AbcSize
  end
end
