# frozen_string_literal: true

module Identities
  # Ensures that user group memberships managed by a given Identity are correct
  class SyncManagedUserGroups
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      add_member: "user_groups.add_member",
      remove_member: "user_groups.remove_member"
    ]

    attr_reader :auth_hash, :identity, :user

    # @param [Identity] identity
    # @param [OmniAuth::Keystore] auth_hash
    # @return [Dry::Monads::Result]
    def call(identity, auth_hash)
      @identity = identity
      @auth_hash = auth_hash

      to_remove.each { |group| remove_member.(group, identity) }
      to_add.each { |group| add_member.(group, identity) }

      return Success()
    end

    def to_add
      @to_add = UserGroup.by_external_identifier(desired_user_group_identifiers - existing_identifiers)
    end

    def to_remove
      @to_remove ||= UserGroup.by_external_identifier(existing_identifiers - desired_user_group_identifiers)
    end

    def desired_user_group_identifiers
      @desired_identifiers ||= auth_hash.info.user_groups&.split(/,;/)&.compact || []
    end

    def existing_user_groups
      @existing_user_groups ||= UserGroupMembership.includes(:user_group).where(source: identity).map(&:user_group)
    end

    def existing_identifiers
      @existing_identifiers ||= existing_user_groups.map(&:external_identifier).compact
    end

  end
end
