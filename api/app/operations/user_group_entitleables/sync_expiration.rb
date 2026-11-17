# frozen_string_literal: true

module UserGroupEntitleables
  class SyncExpiration
    include Dry::Monads[:result]

    # @param [UserGroupEntitleable] entitleable
    # @return [Dry::Monads::Result]
    def call(entitleable)
      entitleable.user_group.memberships.find_each do |membership|
        membership.provided_entitlements.by_subject(entitleable.entitleable).find_each do |entitlement|
          entitlement.update!(expires_on: entitleable.expires_on)
        end
      end

      Success()
    end
  end
end
