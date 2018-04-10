module ManifoldEnv
  # rubocop:disable Style/AndOr, Style/ClassCheck, Metrics/BlockLength
  # rubocop:disable Naming/PredicateName
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
      unless other.kind_of?(self.class)
        raise TypeError, "Cannot compare #{self.class} with #{other.class}"
      end

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
      [app_id.value, secret.value] if has_credentials?
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
      app_id.value.present?
    end

    def has_credentials?
      has_app_id? && has_secret?
    end

    def has_secret?
      secret.value.present?
    end

    # Generates a list of args to be consumed by {Omniauth::Builder#provider}
    #
    # @return [(Symbol, String, String)]
    # @return [(Symbol, String, String, Hash)]
    def provider_args
      [strategy_name, *credentials, strategy_options].compact
    end

    private

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
  # rubocop:enable Style/AndOr, Style/ClassCheck, Metrics/BlockLength
  # rubocop:enable Naming/PredicateName
end
