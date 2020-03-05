module ReadingGroupMemberships
  # Upsert an {EntitlementUserLink} for any active {Entitlement}s that
  # target a given {ReadingGroupMembership}'s {ReadingGroup}.
  class CreateEntitlements < ActiveInteraction::Base
    isolatable!

    transactional!

    record :reading_group_membership

    delegate :reading_group, :user, to: :reading_group_membership

    # @return [void]
    def execute
      return if user.blank?

      Entitlement.active.by_target(reading_group).find_each do |entitlement|
        user_link = EntitlementUserLink.new(entitlement: entitlement, user: user)

        user_link.upsert!
      end
    end
  end
end
