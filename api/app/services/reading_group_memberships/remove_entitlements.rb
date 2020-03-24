module ReadingGroupMemberships
  # Remove all {EntitlementUserLink}s provided to the {ReadingGroup}
  # for the soon-to-be-destroyed {ReadingGroupMembership}.
  #
  # @note We do not remove roles from the user as part of this process.
  #   Because a user might have access to a specific bit of media
  #   through other entitlements, we don't want to remove that just
  #   because they've been removed from one entitlement. Instead,
  #   the {Entitlements::Audit::Perform entitlement audit system} will
  #   remove their access on its next execution.
  class RemoveEntitlements < ActiveInteraction::Base
    isolatable!

    transactional!

    record :reading_group_membership

    delegate :reading_group, :user, to: :reading_group_membership

    # @return [void]
    def execute
      return if user.blank?

      EntitlementUserLink.by_target(reading_group).by_user(user).find_each do |user_link|
        destroy_model! user_link
      end
    end
  end
end
