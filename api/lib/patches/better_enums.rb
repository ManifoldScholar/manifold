# frozen_string_literal: true

# rubocop:disable Layout/LineLength
module Patches
  module BetterEnums
    extend ActiveSupport::Concern

    include ActiveSupport::Configurable

    UNSET = Dux.null("UNSET")

    included do
      include Patches::BetterEnums::BuildsDryType

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

    # @return [Symbol]
    def predicate_name
      :"#{to_sym}?"
    end

    def to_str
      to_s
    end

    module ClassMethods
      # Make this enum an {Patches::BetterEnums::ApplicableEnum ApplicableEnum}.
      #
      # @api private
      # @return [void]
      def applicable!
        include Patches::BetterEnums::ApplicableEnum
      end

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

      # @return [<Symbol>]
      def predicates
        map(&:predicate_name)
      end

      # @api private
      # @param [<String, Symbol, ClassyEnum::Base>] only
      # @param [<String, Symbol, ClassyEnum::Base>] except
      # @return [<ClassyEnum::Base>]
      def constrain(only: [], except: [])
        only    = EnumFilter.new(only)
        except  = EnumFilter.new(except, inverted: true)

        return all if only.blank? && except.blank?

        base_class.select do |enum|
          only.(enum) && except.(enum)
        end
      end

      # @return [Arel::Nodes::Case]
      def as_case_statement(initial = nil, or_else: UNSET, only: [], except: [])
        quoted_expr = Arel::Nodes.build_quoted initial if initial.present?

        statement = Arel::Nodes::Case.new(quoted_expr).tap do |statement|
          unless or_else == UNSET
            other_value = Arel::Nodes.build_quoted or_else

            statement.else(other_value)
            end
        end

        constrain(only: only, except: except).each_with_object(statement) do |enum, statement|
          value = yield enum

          statement.when(enum.to_s).then(value)
          end
      end

      def as_case_order(initial = nil, **options)
        options[:or_else] = order_value_for_else

        as_case_statement(initial, **options, &:index)
      end

      def order_value_for_else
        last_index * 2
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

    # @api private
    class EnumFilter
      def initialize(match_value, inverted: false)
        @match_value = match_value
        @inverted = inverted
      end

      def blank?
        @match_value.blank?
      end

      # @param [ClassyEnum::Base] value
      # @return [Boolean]
      def call(value)
        return true if blank?

        value = matches value

        inverted? ? !value : value
      end

      alias_method :match, :call

      def inverted?
        @inverted
      end

      private

      def matches(value)
        case @match_value
        when Dux[:call] then @match_value.call(value)
        when String, Symbol then value == @match_value
        when Array
          @match_value.empty? || @match_value.any? { |matchable| value == matchable }
        else
          false
        end
      end
    end

    module ApplicableEnum
      extend ActiveSupport::Concern

      included do
        config.should_enforce_owner = false
      end

      def applies?
        return false unless owner.present?

        applies_to? owner
      end

      alias_method :applicable?, :applies?

      # @api private
      # @note Test method
      def applicable_for?(owner)
        applies_to? owner
      end

      private

      # @abstract
      # @param [Object] owner
      def applies_to?(owner)
        false
      end

      module ClassMethods
        # @param [Object] owner
        # @return [Patches::BetterEnum::ApplicableEnum, nil]
        def fetch_for(owner)
          detect do |enum|
            enum.owner = owner

            enum.applies?
          end
        end

        # @param [Object] owner
        # @raise [ClassyEnum::InapplicableEnum] if no applicable enum found
        # @return [Patches::BetterEnums::ApplicableEnum]
        def fetch_for!(owner)
          found = fetch_for(owner)

          raise Patches::BetterEnums::InapplicableEnum, "Could not find applicable enum for #{owner.inspect}" if found.blank?

          return found
        end

        # @param [Object] owner
        # @return [<Patches::BetterEnums::ApplicableEnum>]
        def for_owner(owner)
          each_with_object([]) do |enum, list|
            enum.owner = owner

            list << enum if enum.applies?
          end
        end
      end
    end

    module BuildsDryType
      extend ActiveSupport::Concern

      module ClassMethods
        # @return [Dry::Types::Type]
        def dry_type
          return base_class.dry_type if base_class != self

          @dry_type ||= build_dry_type
        end

        # @api private
        # @return [void]
        def inherited(klass)
          super.tap do
            rebuild_dry_type! unless self == ClassyEnum::Base
          end
        end

        protected

        # @return [void]
        def rebuild_dry_type!
          return base_class.rebuild_dry_type! if base_class != self

          @dry_type = build_dry_type
        end

        private

        # @return [Dry::Types::Type]
        def build_dry_type
          ::Types.Constructor(base_class) do |input|
            base_class.build(input) if input.in?(base_class)
          end.constrained(type: base_class).then do |t|
            apply_dry_type_default_to(t)
          end.then do |t|
            apply_dry_type_fallback_to(t)
          end
        end

        # @param [Dry::Types::Type] type
        # @return [Dry::Types::Type]
        def apply_dry_type_default_to(type)
          if config.dry_type_default.present?
            type.default { base_class.build(config.dry_type_default) }
          else
            type
          end
        end

        # @param [Dry::Types::Type] type
        # @return [Dry::Types::Type]
        def apply_dry_type_fallback_to(type)
          if config.dry_type_fallback.present?
            type.fallback { base_class.build(config.dry_type_fallback) }
          else
            type
          end
        end

        # @return [void]
        def dry_type_default!
          base_config.dry_type_default = @option

          rebuild_dry_type!
        end

        # @return [void]
        def dry_type_fallback!
          base_config.dry_type_fallback = @option

          rebuild_dry_type!
        end
      end
    end

    class InapplicableEnum < StandardError; end

    class InvalidOwner < StandardError; end
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
# rubocop:enable Layout/LineLength

ClassyEnum::Base.include Patches::BetterEnums
ActiveRecord::ConnectionAdapters::AbstractAdapter.prepend Patches::ProperlyQuoteEnums
ActiveModel::Type::ImmutableString.prepend Patches::ProperlySerializeForType
