module ExportStrategies
  # This represents the uploader for a given subclass of {ExportStrategies::AbstractStrategy}.
  #
  # It is never instantiated publicly, but used within the {AbstractConnection#upload!} method.
  #
  # @abstract
  class AbstractUploader
    extend Dry::Initializer
    extend Memoist
    extend ActiveModel::Callbacks

    include Dry::Monads::Result::Mixin
    include Dry::Matcher.for(:call, with: Dry::Matcher::ResultMatcher)
    include ExportStrategies::Haltable

    param :strategy, Types.Instance(ExportStrategies::AbstractStrategy)
    param :connector, Types.Instance(ExportStrategies::AbstractConnection)
    param :connection, Types::Any

    define_model_callbacks :upload

    # @api private
    # @see #upload!
    # @see ExportStrategies::Haltable#haltable!
    # @param [ExportStrategies::UploadPayload] payload
    # @return [Dry::Monads::Result]
    def call(payload)
      haltable! do
        run_callbacks :upload do
          upload! payload
        end
      end
    end

    private

    # @abstract This method should be overriden with how the strategy actually performs uploads.
    # @param [ExportStrategies::UploadPayload] payload
    # @return [void]
    # @return [Dry::Monads::Result::Failure]
    # rubocop:disable Lint/UnusedMethodArgument
    def upload!(payload)
      # :nocov:
      raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      # :nocov:
    end
    # rubocop:enable Lint/UnusedMethodArgument
  end
end
