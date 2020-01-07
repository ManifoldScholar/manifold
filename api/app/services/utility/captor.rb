module Utility
  # Small class to deal with awkward cases where a library's block method
  # doesn't pass through the return value from within the block, but we
  # need it.
  class Captor
    extend Dry::Initializer

    option :default, Types::Any, optional: true
    option :one_time, Types::Bool, default: proc { true }

    # @see Utility::Captor::CaptureAttempt
    # @yield [captor]
    # @yieldparam [Utility::Captor::CaptureAttempt] captor
    # @yieldreturn [void]
    # @return [Object] (@see #store!)
    def capture
      raise "Block required" unless block_given?

      CaptureAttempt.new(self).call(&Proc.new)
    end

    class << self
      # @see #capture
      # @yield [captor]
      # @yieldparam [Utility::Captor::CaptureAttempt] captor
      # @return [Object]
      def capture(**options)
        raise "Block required" unless block_given?

        new(options).capture(&Proc.new)
      end
    end

    # @api private
    class AlreadyCapturedError < StandardError; end

    # @api private
    class CaptureAttempt
      extend Dry::Initializer

      param :captor, Types.Instance(Utility::Captor)

      delegate :default, :one_time, to: :captor

      # @yield [captor]
      # @yieldparam [self] captor
      # @yieldreturn [void]
      # @return [Object]
      def call
        yield self

        instance_variable_defined?(:@captured) ? @captured : default
      end

      # @param [Object] value
      # @raise [Utility::Captor::AlreadyCapturedError]
      # @return [void]
      def store!(value)
        raise AlreadyCapturedError, "Already captured a value from #{@captured_at}" if frozen?

        @captured_at = caller(1..1).first
        @captured = value
      ensure
        freeze if one_time
      end

      alias << store!
    end
  end
end
