# frozen_string_literal: true

module GlobalTypes
  # This type represents an array that can contain literally anything.
  #
  # @note This and its subclasses are for use with StoreModel objects, as they do not
  #   support the same `array: true` syntax that ActiveRecord's `attribute` API does.
  class AnyArray < ActiveModel::Type::Value
    extend Dry::Core::ClassAttributes

    # @!parse [ruby]
    #   class << self
    #     # @api private
    #     # @overload element_type(new_type)
    #     #   Set the `element_type` for this array type.
    #     #   @param [Dry::Types::Type] new_type
    #     #   @return [void]
    #     # @overload element_type
    #     #   Retrieve the dry.rb type used for elements in this array type.
    #     #   @return [Dry::Types::Type]
    #     def element_type(*)
    #     end
    #   end
    defines :element_type

    element_type Dry::Types["any"]

    # Cast a value to an array.
    # @param [Array] value
    # @return [Array]
    def cast(value)
      Dry::Types["coercible.array"].of(self.class.element_type).try(value).to_monad.value_or([])
    end

    # @!attribute [r] type
    # A computer-readable type name.
    # @return [:any_array]
    # @see .type
    def type
      self.class.type
    end

    class << self
      # Calculate the {#type} for this class.
      #
      # @api private
      def type
        @type ||= name.demodulize.parameterize.underscore.to_sym
      end
    end
  end

  # This is a typed subclass that represents a `text[]`.
  #
  # It is available to `StoreModel` objects as `:string_array`.
  class StringArray < AnyArray
    element_type Dry::Types["coercible.string"]

    # @!method cast(value)
    # Coerce a given value to an array of strings.
    # @note If any value fails, it will return an empty array instead.
    # @param [<#to_s>] value
    # @return [<String>]

    # @!attribute [r] type
    # @return [:string_array]
  end

  # This is a typed subclass that represents an `int[]`.
  #
  # It is available to `StoreModel` objects as `:integer_array`.
  class IntegerArray < AnyArray
    element_type Dry::Types["coercible.integer"]

    # @!method cast(value)
    # Coerce a given value to an array of integers.
    # @note If any value fails, it will return an empty array instead.
    # @param [<#to_i>] value
    # @return [<Integer>]

    # @!attribute [r] type
    # @return [:integer_array]
  end

  # This represents literally any JSON-serializable object.
  #
  # It is available to `StoreModel` objects as `:any_json`.
  class AnyJSON < ActiveModel::Type::Value
    # @param [#as_json] value
    # @return [Object] a JSON-serializable object
    def cast(value)
      value.as_json
    end

    # @!attribute [r] type
    # A computer-readable type name.
    # @return [:any_json]
    def type
      :any_json
    end
  end
end

ActiveModel::Type.register :any_array, GlobalTypes::AnyArray
ActiveModel::Type.register :any_json, GlobalTypes::AnyJSON
ActiveModel::Type.register :string_array, GlobalTypes::StringArray
ActiveModel::Type.register :integer_array, GlobalTypes::IntegerArray
