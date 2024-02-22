# frozen_string_literal: true

module SettingSections
  # A base class for defining settings in different semantic "sections"
  # of the {Settings} record.
  #
  # @abstract
  # @see Settings
  class Base
    extend Dry::Core::ClassAttributes

    include Utility::EnhancedStoreModel

    REDACTED = "(redacted)"

    defines :section_name, type: Types::Symbol.optional

    defines :redact_all, type: Types::Bool
    defines :redaction_mask, type: Types::String

    defines :exposed_derived_attributes, type: Types::Array.of(Types::Symbol)
    defines :redacted_attributes, type: Types::Array.of(Types::Symbol)
    defines :skipped_strong_params, type: Types::Array.of(Types::Symbol)

    redact_all false

    redaction_mask REDACTED

    exposed_derived_attributes []

    redacted_attributes []

    skipped_strong_params []

    # @return [Hash]
    def to_serialized_response
      output = as_json(serialize_unknown_attributes: false).with_indifferent_access.merge(slice(*self.class.exposed_derived_attributes))

      redact output
    end

    private

    # @param [Hash] output
    # @return [Hash]
    def redact(output)
      if redact_all?
        output.transform_values { self.class.redaction_mask }
      else
        self.class.redaction_filter.filter(output)
      end
    end

    def redact_all?
      self.class.redact_all
    end

    class << self
      # @param [<Symbol>] attributes
      def expose!(*attributes)
        attrs = attributes.flatten.map(&:to_sym)

        new_attrs = exposed_derived_attributes | attrs

        exposed_derived_attributes new_attrs
      end

      # @api private
      # @param [Class] subclass
      # @return [void]
      def inherited(subclass)
        super

        subclass.section_name subclass.name.demodulize.underscore.to_sym
      end

      # @param [<Symbol>] attributes
      # @return [void]
      def redact!(*attributes)
        attrs = attributes.flatten.map(&:to_sym)

        new_attrs = redacted_attributes | attrs

        redacted_attributes new_attrs

        recompile_redaction_filter!
      end

      # @return [void]
      def redact_all!
        redact_all true
        redact! *attribute_names
      end

      # @return [ActiveSupport::ParameterFilter]
      def redaction_filter
        @redaction_filter ||= compile_redaction_filter
      end

      # @return [<Symbol>]
      def strong_params
        @strong_params ||= compile_strong_params
      end

      private

      # @return [ActiveSupport::ParameterFilter]
      def compile_redaction_filter
        ActiveSupport::ParameterFilter.new(redacted_attributes, mask: redaction_mask)
      end

      # @return [<String>]
      def compile_strong_params
        attribute_names.map(&:to_sym) - skipped_strong_params
      end

      # @return [void]
      def recompile_redaction_filter!
        @redaction_filter = compile_redaction_filter
      end

      # @return [void]
      def recompile_strong_params!
        @strong_params = compile_strong_params
      end
    end
  end
end
