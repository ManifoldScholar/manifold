module ExportStrategies
  # Top-level configuration object for export targeting.
  #
  # It is composed of various subobjects that correspond to the strategies
  # represented by {ExportTargetStrategy}.
  class Configuration
    include StoreModel::Model
    include HasFilteredAttributes

    # Matches an attribute name that ends with `password` that isn't `sftp_password`.
    #
    # @api private
    NON_SFTP_PASSWORD = /(?<!sftp_)password\z/.freeze
    filter_attributes! NON_SFTP_PASSWORD, :private_key

    DEFAULT_TARGET_NAME_FORMAT = "%s-%t.%e".freeze

    STRATEGIES = ExportTargetStrategy.map(&:to_sym).freeze
    ENABLED_STRATEGIES = ExportTargetStrategy.enabled.freeze

    attribute :sftp_key, ExportStrategies::SFTPKeyStrategy.to_type
    attribute :sftp_password, ExportStrategies::SFTPPasswordStrategy.to_type
    attribute :target_name_format, :string, default: DEFAULT_TARGET_NAME_FORMAT

    enum :strategy, STRATEGIES, default: :unknown

    set_callback :validate, :before, :clear_unused_strategies!

    validates :sftp_key, store_model: { merge_errors: true }, if: :using_sftp_key?
    validates :sftp_password, store_model: { merge_errors: true }, if: :using_sftp_password?
    validates :target_name_format, presence: true

    validate :target_name_format_is_valid!

    # @!attribute [r] configured_strategy
    # @return [ExportStrategies::AbstractStrategy]
    def configured_strategy
      raise ExportStrategies::DisabledStrategy, "#{strategy} is not enabled" unless strategy.in?(ENABLED_STRATEGIES)

      public_send strategy
    end

    # @see ExportStrategies::AbstractStrategy#upload!
    # @raise [ExportStrategies::DisabledStrategy] if using a disabled strategy
    # @param [ExportStrategies::Payload] payload
    # @return [Dry::Monads::Result]
    def upload_with_chosen_strategy!(payload)
      with_valid_configured_strategy do |configured|
        configured.upload! payload
      end
    end

    # @param [#to_s] value
    def using_strategy?(value)
      strategy == value.to_s
    end

    # @see #using_strategy?
    def using_sftp_key?
      using_strategy? :sftp_key
    end

    # @see #using_strategy?
    def using_sftp_password?
      using_strategy? :sftp_password
    end

    # @see #configured_strategy
    # @raise [RuntimeError] if called without a block
    # @raise [ExportStrategies::DisabledStrategy] if the strategy is disabled
    # @raise [ExportStrategies::MisconfiguredStrategy] if the strategy has become invalid somehow
    # @yield [configured_strategy] yields the validated and {#configured_strategy}
    # @yieldparam [ExportStrategies::AbstractStrategy] configured_strategy
    # @yieldreturn [Object]
    # @return [Object] the return value of the block
    def with_valid_configured_strategy
      raise "Block required for #{self.class}##{__method__}" unless block_given?

      strat = configured_strategy

      unless strat.valid?
        errors = strat.errors.full_messages.to_sentence

        raise ExportStrategies::MisconfiguredStrategy, "The strategy is invalid: #{errors}", caller
      end

      yield strat
    end

    private

    # @return [void]
    def clear_unused_strategies!
      STRATEGIES.each do |strategy|
        next unless has_attribute? strategy
        next if using_strategy? strategy

        public_send :"#{strategy}=", nil
      end
    end

    # @return [void]
    def target_name_format_is_valid!
      return unless target_name_format.present?

      ExportStrategies::TargetNameFormatter.new.call(target_name_format) do |m|
        m.success { |*| true }
        m.failure(:invalid_format) { |(_code, reason)| errors.add :target_name_format, "has an invalid format: #{reason}" }
        m.failure { |(_code, reason)| errors.add :target_name_format, "could not be checked: #{reason}" }
      end
    end
  end
end
