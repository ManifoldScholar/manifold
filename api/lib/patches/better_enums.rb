module Patches
  module BetterEnums
    extend ActiveSupport::Concern

    include ActiveSupport::Configurable

    included do
      delegate :base_config, :type_casted, to: :class
    end

    def display_name
      text
    end

    def first_enum?
      index == 1
    end

    def last_enum?
      index == self.class.last_index
    end

    def inspect
      self.class < base_class ? "#{base_class.name}[:#{self}]" : super
    end

    def to_str
      to_s
    end

    class_methods do
      # @!attribute [r] base_config
      # @return [ActiveSupport::Configurable::Configuration]
      def base_config
        base_class.config
      end

      def fetch(value, default: nil)
        found = self[value]

        return found if found.present?

        if default.present?
          found_default = self[default]

          raise "Could not find #{value.inspect}; invalid default: #{default.inspect}" unless found_default.present?

          return found_default
        end

        raise "Could not find #{value.inspect}"
      end

      # @!attribute [r] last_index
      # @return [Integer]
      def last_index
        if base_class == self
          @last_index ||= last.index
        else
          base_class.last_index
        end
      end

      # @return [<String>, String]
      def type_casted
        if base_class == self
          self[base_config.default_type_casted_value] || first
        else
          @option.to_s
        end.to_s
      end
    end
  end

  module ProperlyQuoteEnums
    def _type_cast(value)
      case value
      when Dux.inherits(ClassyEnum::Base), ClassyEnum::Base then value.type_casted
      else
        super
      end
    end
  end

  module ProperlySerializeForType
    def serialize(value)
      case value
      when Dux.inherits(ClassyEnum::Base), ClassyEnum::Base then value.type_casted
      else
        super
      end
    end
  end
end

ClassyEnum::Base.include Patches::BetterEnums
ActiveRecord::ConnectionAdapters::AbstractAdapter.prepend Patches::ProperlyQuoteEnums
ActiveModel::Type::ImmutableString.prepend Patches::ProperlySerializeForType
