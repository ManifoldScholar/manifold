module Utility
  # Store a collection of values, uniquely indexed by an attribute.
  #
  # Works a lot like a `Hash`, except it only allows values to be set once
  # or it will raise {Utility::IndexMap::AlreadyStoredObjectError an error}.
  class IndexMap
    include Enumerable

    extend Dry::Initializer
    extend Memoist

    param :key_method, Types::Coercible::Symbol
    param :type_constraint, Types.Instance(Dry::Types::Type), default: Types::Any

    # @param [Object] key
    # @raise [KeyError] if no object found for the given key
    # @return [Object]
    def [](key)
      cache.fetch(key)
    end

    # @param [Object] object
    # @raise [Utility::IndexMap::AlreadyStoredObjectError] if trying to set something with a duplicate key
    #   that isn't the same object (determined by `==` / simple equality).
    # @return [self]
    def store(object)
      key = key_for_valid object

      existing_object = cache.put_if_absent(key, object)

      raise AlreadyStoredObjectError.new(key, existing_object, object) if !existing_object.nil? && existing_object != object

      return self
    end

    alias << store

    # @!group Enumerable methods

    def each
      return enum_for(__method__) unless block_given?

      cache.each_pair do |key, value|
        yield key, value
      end
    end

    def each_value
      return enum_for(__method__) unless block_given?

      cache.each_value do |value|
        yield value
      end
    end

    # @param [#to_s] key
    def include?(key)
      cache.key? key.to_s
    end

    # @return [<Object>]
    def to_a
      each_value.to_a
    end

    delegate :first, :last, :length, :size, to: :to_a

    # @return [{ Object => Object }]
    def to_h
      each.to_h
    end

    # @!endgroup

    private

    # @!attribute [r] cache
    # @return [Concurrent::Map]
    memoize def cache
      Concurrent::Map.new
    end

    # @param [Object] object
    # @return [Object]
    def key_for_valid(object)
      valid_object = value_validator[object]

      valid_object.public_send(key_method)
    end

    # @!attribute [r] key_method_type
    # Returns an interface type that ensures that the
    # provided object(s) `respond_to?` {#key_method}.
    # @return [Dry::Types::Type]
    memoize def key_method_type
      Types.Interface(key_method)
    end

    # @!attribute [r] value_validator
    # @return [Dry::Types::Type]
    memoize def value_validator
      key_method_type | type_constraint
    end

    # An error raised for a pair of objects that would violate the {Utility::IndexMap}'s
    # unique constraint requirement.
    class AlreadyStoredObjectError < StandardError
      def initialize(key, old_object, new_object)
        super("Already stored object #{old_object.inspect} at #{key.inspect}, tried to store #{new_object.inspect}")
      end
    end
  end
end
