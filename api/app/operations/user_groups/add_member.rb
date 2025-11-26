# frozen_string_literal: true

module UserGroups
  class AddMember
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      upsert_user_group_entitlements: "user_groups.upsert_entitlements",
    ]

    include UserGroups::ParsesIdentity

    # @param [User] user
    # @return [Dry::Monads::Result]
    def call(user_group, user_or_identity)
      parse_user_or_identity(user_or_identity)
      membership = user_group.user_group_memberships.find_or_create_by(user:, identity:)

      return Success(membership)
    end


  end
end
