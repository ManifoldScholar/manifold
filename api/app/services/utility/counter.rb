module Utility
  # Simple counter for approaches that won't easily work with `reduce`.
  class Counter
    extend Dry::Initializer

    param :initial_value, Types::Integer, default: proc { 0 }

    # @return [Integer]
    def call
      reset!

      yield self if block_given?

      to_int
    ensure
      reset!
    end

    def reset!
      @counter = initial_value
    end

    def increment(value)
      @counter += coerce(value)

      return self
    end

    alias incr increment
    alias + increment

    def decrement(value)
      @counter -= coerce(value)

      return self
    end

    alias decr decrement
    alias - decrement

    def to_i
      @counter || initial_value
    end

    alias to_int to_i

    private

    def coerce(value)
      Types::Coercible::Integer[value]
    end
  end
end
