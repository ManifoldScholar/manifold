# frozen_string_literal: true

module Identities
  # Ensures that entitlements managed by a given Identity are correct
  class SyncManagedEntitlements
    include Dry::Monads[:result, :do]

    ENTITLEABLES = [Project, ProjectCollection, Journal].freeze
    ROLE = { scoped_roles: { read_access: true } }

    attr_reader :auth_hash, :identity, :user

    # @param [Identity] identity
    # @param [OmniAuth::Keystore] auth_hash
    # @return [Dry::Monads::Result]
    def call(identity, auth_hash)
      @identity = identity
      @auth_hash = auth_hash

      to_remove.each do |entitleable|
        Entitlement.by_entitling_entity(identity).by_subject(entitleable).destroy_all
      end

      to_add.each do |entitleable|
        Entitlements::Create.run(
          entitling_entity: identity,
          subject: entitleable,
          target: identity.user,
          **ROLE
        )
      end

      return Success()
    end

    def to_add
      return @to_add if @to_add

      identifiers = desired_entitleable_identifiers - existing_identifiers
      @to_add ||= ENTITLEABLES.flat_map do |klass|
        klass.by_external_identifier(identifiers).to_a
      end
    end

    def to_remove
      return @to_remove if @to_remove

      identifiers = existing_identifiers - desired_entitleable_identifiers
      @to_remove ||= ENTITLEABLES.flat_map do |klass|
        klass.by_external_identifier(identifiers).to_a
      end
    end

    def desired_entitleable_identifiers
      @desired_identifiers ||= auth_hash.info.entitlements&.split(/,;/)&.compact || []
    end

    def existing_entitlements
      @existing_user_groups ||= Entitlement.where(entitler: identity.to_upsertable_entitler)
    end

    def existing_identifiers
      @existing_identifiers ||= existing_entitlements.map do |entitlement|
        entitlement.subject.external_identifier&.identifier
      end.compact
    end

  end
end
