module SerializableAuthorization
  extend ActiveSupport::Concern
  include ActiveSupport::Configurable

  DEFAULT_ABILITIES = %i[create read update delete].freeze

  included do
    config_accessor :exposed_abilities
    config.exposed_abilities = DEFAULT_ABILITIES.dup
  end

  # Introspect a verb symbol to authorize for a given user / options
  #
  # @param [Symbol] verb
  # @param [User] user
  # @param [{ Symbol => Object }] options
  def able_to?(verb, user, **options)
    adjective = Authority.abilities.fetch verb

    predicate = :"#{adjective}_by?"

    public_send(predicate, user, **options)
  end

  # @param [User, Authority::UserAbilities] user
  # @param [{ Symbol => Object }]
  # @return [{ Symbol => Boolean }]
  def to_serializable_hash_for(user, **options)
    exposed_abilities.each_with_object({}) do |ability, h|
      h[ability] = able_to?(ability, user, options)
    end
  end

  class_methods do
    def able_to?(verb, user)
      adjective = Authority.abilities.fetch verb
      predicate = :"#{adjective}_by?"
      public_send(predicate, user)
    end

    def to_serializable_hash_for(user)
      exposed_abilities.each_with_object({}) do |ability, h|
        h[ability] = able_to?(ability, user)
      end
    end

    # @param [<Symbol>] abilities abilities to expose
    # @param [Boolean] include_default whether to include {DEFAULT_ABILITIES}
    # @return [void]
    def expose_abilities(*abilities, include_default: true)
      abilities.flatten!.map!(&:to_sym).each do |ability|
        raise "Unknown ability: #{ability}" unless Authority.abilities.key?(ability)
      end
      config.exposed_abilities =
        include_default ? abilities | DEFAULT_ABILITIES : abilities
    end
  end
end
