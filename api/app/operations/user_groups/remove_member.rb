# frozen_string_literal: true

module UserGroups
  class RemoveMember
    include Dry::Monads[:result, :do]

    include UserGroups::ParsesIdentity

    # Destroys group membership associated with the passed identity or user
    # Group membership destruction cascades to associated entitlements
    # @param [UserGroup] user_group
    # @param [User, Identity] user_or_identity
    # @return [Dry::Monads::Result]
    def call(user_group, user_or_identity)
      parse_user_or_identity(user_or_identity)

      user_group.memberships.where(user:, identity:).destroy_all

      Success()
    end
  end
end
