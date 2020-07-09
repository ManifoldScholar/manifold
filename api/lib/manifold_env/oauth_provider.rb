module ManifoldEnv
  class OauthProvider
    include Comparable
    include Equalizer.new(:name)
    include ManifoldEnv::HasConfigurationDSL
    include ActiveModel::Validations
    include Redis::Objects

    value :app_id
    value :secret

    CREDENTIAL_KEYS = %i(id secret).freeze

    validates :credentials, presence: { message: "are unset" }

    attr_reader :name

    alias id name

    def initialize(name)
      @name = name
    end

    def <=>(other)
      raise TypeError, "Cannot compare #{self.class} with #{other.class}" unless other.is_a?(self.class)

      name <=> other.name
    end

    def =~(other)
      indifferently_compare(name, other) ||
        indifferently_compare(strategy_name, other)
    end

    # @!attribute [r] credentials
    # @return [(String, String)] if {#has_credentials?}
    # @return [nil]
    def credentials
      return nil unless has_credentials?

      custom? ? custom.credentials : [app_id.value, secret.value]
    end

    # @!attribute [r] custom
    # @return [ManifoldEnv::CustomOauthProvider, nil]
    def custom
      @custom = ManifoldEnv.oauth.custom(name) unless instance_variable_defined?(:@custom)

      @custom
    end

    def custom?
      custom.present?
    end

    alias enabled? valid?

    configurable_property :settings_key do
      name
    end

    configurable_property :strategy_name do
      name
    end

    configurable_hash :strategy_options

    def has_app_id?
      if custom?
        custom.client_id.present?
      else
        app_id.value.present?
      end
    end

    def has_credentials?
      has_app_id? && has_secret?
    end

    def has_secret?
      if custom?
        custom.client_secret.present?
      else
        secret.value.present?
      end
    end

    # Generates a list of args to be consumed by {Omniauth::Builder#provider}
    #
    # @return [(Symbol, String, String)]
    # @return [(Symbol, String, String, Hash)]
    def provider_args
      [strategy_name, *credentials, full_strategy_options].compact
    end

    def as_json(_options = nil)
      {}.tap do |h|
        h[:custom] = custom?
        h[:enabled] = enabled?
        h[:name] = name
        h[:descriptive_name] = custom? ? custom.descriptive_name : name.to_s.titleize
      end
    end

    private

    def full_strategy_options
      {}.merge(strategy_options || {}).tap do |h|
        h[:strategy_class] = custom.strategy_class if custom?
      end.presence
    end

    # rubocop:disable Style/CaseEquality
    def indifferently_compare(left, right)
      if right.is_a?(String)
        left.to_s == right
      else
        left === right
      end
    end
    # rubocop:enable Style/CaseEquality
  end
  # rubocop:enable
end
