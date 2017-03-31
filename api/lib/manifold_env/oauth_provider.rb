module ManifoldEnv
  # rubocop:disable Style/AndOr, Style/ClassCheck, Metrics/BlockLength
  # rubocop:disable Style/PredicateName
  class OauthProvider
    include Comparable
    include Equalizer.new(:name)
    include ManifoldEnv::HasConfigurationDSL
    include ActiveModel::Validations

    CREDENTIAL_KEYS = %i(id secret).freeze

    validates :credentials, presence: { message: "are unset" }

    attr_reader :name

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
      @credential_hash.values_at(*CREDENTIAL_KEYS) if has_credentials?
    end

    alias enabled? valid?

    # @!attribute [r] env_infix
    # The unique infix for the environment variables
    # @return [String]
    configurable_property :env_infix do
      name.to_s.upcase[0..1]
    end

    configurable_property :settings_key do
      name
    end

    configurable_property :strategy_name do
      name
    end

    configurable_hash :strategy_options

    def env_vars
      CREDENTIAL_KEYS.map do |key|
        "OAUTH_#{env_infix}_#{key.to_s.upcase}"
      end
    end

    def has_credentials?
      CREDENTIAL_KEYS.all? do |key|
        @credential_hash.present? && @credential_hash[key].present?
      end
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

    dsl do
      def set_credentials(id, secret)
        id      &&= id.to_s
        secret  &&= secret.to_s

        ivar_set :credential_hash, id: id, secret: secret
      end

      def detect_credentials!
        read_from_config = manifold_settings.oauth!.underbang_reader(settings_key)

        set_credentials read_from_config[:id], read_from_config[:secret]
      end
    end
  end
end
