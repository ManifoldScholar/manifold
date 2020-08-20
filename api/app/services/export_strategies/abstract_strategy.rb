module ExportStrategies
  # @abstract
  class AbstractStrategy
    extend Dry::Configurable

    include Sliceable
    include StoreModel::Model

    # The minimum value for a TCP port
    MIN_TCP_PORT = 1

    # The max TCP port (defined as `2 ** 16 - 1`)
    MAX_TCP_PORT = 65_535

    delegate :connection_klass, to: :class

    def connect(&block)
      # :nocov:
      with_connection do |c|
        c.connect!(&block)
      end
      # :nocov:
    end

    def to_connection
      connection_klass.new(self)
    end

    # @see ExportStrategies::AbstractConnection#upload!
    # @param [ExportTargets::Payload] payload
    # @return [Dry::Monads::Result]
    def upload!(payload)
      with_connection do |conn|
        conn.upload! payload
      end
    end

    def with_connection
      yield to_connection if block_given?
    end

    class << self
      # Adds a `port` attribute to the strategy.
      #
      # @param [Symbol] attribute_name
      # @param [Integer] default
      # @param [Integer] min_value
      # @param [Integer] max_value
      # @return [void]
      # rubocop:disable Naming/PredicateName
      def has_port!(attribute_name = :port, default:, min_value: MIN_TCP_PORT, max_value: MAX_TCP_PORT)
        attribute attribute_name, :integer, default: default

        validates(
          attribute_name,
          numericality: {
            greater_than_or_equal_to: min_value,
            less_than_or_equal_to: max_value,
            integer_only: true
          }
        )
      end
      # rubocop:enable Naming/PredicateName

      # Augment the {.connection_klass subclass} of {ExportTargets::AbstractConnection}
      # for this specific strategy.
      #
      # @yield a class-evaled block
      # @yieldreturn [void]
      # @return [void]
      def connection
        connection_klass.tap do |klass|
          klass.class_eval(&Proc.new) if block_given?
        end
      end

      # @!attribute [r] connection_klass
      # A reference to the automatically-inherited subclass of {ExportTargets::AbstractConnection}.
      #
      # If it hasn't been defined yet, it will be set up and placed on the `:Connection` constant for
      # the class. Each connection class inherits from each strategy's parent connection class.
      #
      # @see ExportStrategies::AbstractConnection
      # @see .parent_connection_klass
      # @return [Class]
      def connection_klass
        unless @connection_klass.present?
          @connection_klass = klass = Class.new parent_connection_klass

          klass.config.strategy_klass = self
          klass.config.uploader_klass = uploader_klass

          const_set :Connection, klass
        end

        const_get :Connection
      end

      # @!attribute [r] parent_connection_klass
      # Determine the parent connection class to be inherited by {.connection_klass}.
      # @see ExportStrategies::AbstractConnection
      # @return [Class]
      def parent_connection_klass
        AbstractStrategy == self ? ExportStrategies::AbstractConnection : superclass.connection_klass
      end

      # Augment the {.uploader_klass subclass} of {ExportTargets::AbstractUploader}
      # for this specific strategy.
      #
      # @yield a class-evaled block
      # @yieldreturn [void]
      # @return [void]
      def uploader
        uploader_klass.tap do |klass|
          klass.class_eval(&Proc.new) if block_given?
        end
      end

      # @!attribute [r] uploader_klass
      # A reference to the automatically-inherited subclass of {ExportTargets::AbstractUploader}.
      #
      # If it hasn't been defined yet, it will be set up and placed on the `:Uploader` constant for
      # the class. Each uploader class inherits from each strategy's parent uploader class.
      #
      # @see ExportStrategies::AbstractUploader
      # @see .parent_uploader_klass
      # @return [Class]
      def uploader_klass
        unless @uploader_klass.present?
          @uploader_klass = klass = Class.new parent_uploader_klass

          const_set :Uploader, klass
        end

        const_get :Uploader
      end

      # @!attribute [r] parent_uploader_klass
      # Determine the parent uploader class to be inherited by {.uploader_klass}.
      # @see ExportStrategies::AbstractUploader
      # @return [Class]
      def parent_uploader_klass
        AbstractStrategy == self ? ExportStrategies::AbstractUploader : superclass.uploader_klass
      end
    end
  end
end
