module ExportStrategies
  # This represents a single connection attempt for a given subclass of {ExportStrategies::AbstractStrategy}.
  #
  # It is never instantiated directly, but instead via the above class hierarchy's `connect`
  #
  # @abstract
  class AbstractConnection
    extend Dry::Configurable
    extend Dry::Initializer
    extend Memoist
    extend ActiveModel::Callbacks

    include Dry::Monads::Result::Mixin
    include Dry::Matcher.for(:upload!, with: Dry::Matcher::ResultMatcher)
    include ExportStrategies::Haltable

    setting :strategy_klass, default: ExportStrategies::AbstractStrategy, reader: true
    setting :uploader_klass, default: ExportStrategies::AbstractUploader, reader: true

    param :strategy, Types.Instance(ExportStrategies::AbstractStrategy)

    define_model_callbacks :clean_up, :configure, :connect, :connection

    delegate :strategy_klass, :uploader_klass, to: :class

    # @api private
    # @see #establish_connection!
    # @see ExportStrategies::Haltable#haltable!
    # @yield [connection] yield the connection object
    # @yieldparam [Object] connection
    # @yieldreturn [Dry::Monads::Result, nil]
    # @return [Dry::Monads::Result]
    # rubocop:disable Metrics/MethodLength
    def connect!
      raise "Must provide a block to connect!" unless block_given?

      haltable! do
        run_callbacks :connection do
          prepare_configuration!

          run_callbacks :configure do
            configure!
          end

          run_callbacks :connect do
            establish_connection!(&Proc.new)
          end
        end
      end
    ensure
      run_callbacks :clean_up do
        clean_up!
      end
    end
    # rubocop:enable Metrics/MethodLength

    # @see ExportStrategies::AbstractUploader#call
    # @param [ExportStrategies::UploadPayload] payload
    # @return [Dry::Monads::Result]
    def upload!(payload)
      connect! do |connection|
        uploader_klass.new(strategy, self, connection).(payload)
      end
    end

    private

    # @see Utility::Captor.capture
    # @param [{ Symbol => Object }] options (@see Utility::Captor#initialize)
    # @yield [captor] (@see Utility::Captor#capture)
    # @yieldparam [Utility::Captor::CaptureAttempt] captor
    # @yieldreturn [void]
    # @return [Object]
    def capture(**options)
      raise "Block required" unless block_given?

      Utility::Captor.capture(options, &Proc.new)
    end

    # @abstract
    # @return [void]
    def clean_up!; end

    # @abstract
    # @return [void]
    def configure!; end

    # @abstract
    # @yield [connection] yield the connection object
    # @yieldparam [Object] connection
    # @yieldreturn [Dry::Monads::Result]
    # @return [Dry::Monads::Result]
    def establish_connection!(*)
      # :nocov:
      raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      # :nocov:
    end

    # @abstract
    # @return [void]
    def prepare_configuration!; end
  end
end
