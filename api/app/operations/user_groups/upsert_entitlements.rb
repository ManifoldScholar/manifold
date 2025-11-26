# frozen_string_literal: true

module UserGroups
  class UpsertEntitlements
    include Dry::Monads[:result, :do]

    attr_reader :membership

    delegate :user, :user_group, to: :membership

    # @param [User] user
    # @return [Dry::Monads::Result]
    def call(membership)
      @membership = membership

      user_group.user_group_entitleables.each do |user_group_entitleable|
        next if existing_entitlements.include? user_group_entitleable.entitleable

        Entitlements::Create.run(
          target: user,
          subject: user_group_entitleable.entitleable,
          entitling_entity: membership,
          scoped_roles: { read_access: true }
        )
      end

      return Success()
    end

    def existing_entitlements
      @existing_entitlements ||= Entitlement.where(
        target: user_group.user_group_entitleables,
        subject: user
      ).map(&:target)
    end
  end
end
