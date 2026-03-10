# frozen_string_literal: true

module UserGroups
  class SyncMemberEntitlements
    include Dry::Monads[:result, :do]

    attr_reader :user_group

    delegate :user, :memberships, to: :user_group

    # @param [UserGroup] user_group
    # @return [Dry::Monads::Result]
    def call(user_group)
      user_group.memberships.each do |membership|
        UserGroupMemberships::SyncEntitlements.new.call(membership)
      end

      Success()
    end
  end
end
