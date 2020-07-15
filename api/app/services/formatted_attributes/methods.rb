module FormattedAttributes
  class Methods < Module
    attr_reader :definition

    delegate :attribute, :include_wrap?, to: :definition
    delegate :attribute, :renderer_options, to: :definition
    delegate :attribute, :container, to: :definition

    # rubocop:disable Metrics/MethodLength
    def initialize(definition)
      @definition = definition

      @method_names = {
        unformatted_value: "unformatted_value_for_#{attribute}",
        prime_formatted_caches: "prime_formatted_attribute_caches_for_#{attribute}",
        formatted_cache_key: :"cache_key_for_formatted_#{attribute}",
        plaintext_cache_key: :"cache_key_for_plaintext_#{attribute}",
        format: :"format_#{attribute}",
        formatted: :"#{attribute}_formatted",
        plaintext: :"#{attribute}_plaintext",
        refresh: :"refresh_formatted_#{attribute}",
        textify: :"textify_#{attribute}",
        saved_changed_to?: :"saved_change_to_#{attribute}",
        update_db_cache: :"update_db_cache_for_formatted_#{attribute}",
        db_cacheable?: :"formatted_#{attribute}_db_cacheable?"
      }

      initialize_methods!
    end
    # rubocop:enable Metrics/MethodLength

    def method_name(key)
      @method_names.fetch(key)
    end

    private

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def initialize_methods!
      class_eval <<~RUBY, __FILE__, __LINE__ + 1
        extend ActiveSupport::Concern

        included do
          before_save :#{method_name(:update_db_cache)}, if: :#{method_name(:db_cacheable?)}
          after_save :#{method_name(:refresh)}, if: :#{method_name(:saved_changed_to?)}
        end

        class_methods do
          def #{method_name(:prime_formatted_caches)}
            all.each do |resource|
              resource.#{method_name(:refresh)}
              resource.#{method_name(:update_db_cache)}
              resource.save
            end
          end
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

        def #{method_name(:unformatted_value)}
          #{container.present? ? "#{container}.dig('#{attribute}')" : attribute.to_s}
        end

        def #{method_name(:format)}
          _value = #{container.present? ? "#{container}.dig('#{attribute}')" : attribute.to_s}
          SimpleFormatter.run!(
            input:  _value,
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

        def #{method_name(:update_db_cache)}
          format = "cached_#{attribute}_formatted="
          plaintext = "cached_#{attribute}_plaintext="
          send(format, #{method_name(:format)}) if respond_to?(format)
          send(plaintext, #{method_name(:plaintext)}) if respond_to?(plaintext)
        end

        def #{method_name(:db_cacheable?)}
          return false unless respond_to?("cached_#{attribute}_formatted=") || respond_to?("cached_#{attribute}_plaintext=")
          return true if (send("cached_#{attribute}_formatted").nil? || send("cached_#{attribute}_plaintext").nil?) && #{method_name(:unformatted_value)}.present?
          return false unless respond_to? "#{attribute}_changed?"
          #{attribute}_changed?
        end

        private

        def #{method_name(:formatted_cache_key)}
          "#{Rails.env.downcase}/\#{model_name.cache_key}/\#{id}/formatted/#{attribute}"
        end

        def #{method_name(:plaintext_cache_key)}
          "#{Rails.env.downcase}/\#{model_name.cache_key}/\#{id}/plaintext/#{attribute}"
        end
      RUBY

      return unless container.present?

      class_eval <<-RUBY, __FILE__, __LINE__ + 1

        def #{method_name(:saved_changed_to?)}
          "#{container}_before_last_save.dig('#{attribute}') != #{container}.dig('#{attribute}')"
        end

      RUBY
    end

    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
  end
end
