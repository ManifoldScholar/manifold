module OurTypes
  # Wrapper around a JSONB column that always provides an indifferent hash.
  class IndifferentHash < ActiveRecord::ConnectionAdapters::PostgreSQL::OID::Jsonb
    CAN_TO_H = ->(o) { o.respond_to?(:to_h) }

    # Type cast a value from user input (e.g. from a setter).
    #
    # @param [Hash, #to_h] value
    # @return [ActiveSupport::HashWithIndifferentAccess]
    def cast(value)
      case value
      when Hash then value
      when CAN_TO_H
        value.to_h
      else
        Hash.try_convert(value) || {}
      end.with_indifferent_access
    end

    # Casts a value from database input to appropriate ruby type.
    #
    # @param [Hash, #to_h] value
    # @return [ActiveSupport::HashWithIndifferentAccess]
    def deserialize(value)
      # Normal ActiveRecord::Type behavior is to allow nils, but we *always* want a hash.
      cast(super)
    end

    def accessor
      ActiveRecord::Store::IndifferentHashAccessor
    end
  end
end
