# frozen_string_literal: true

module UserGroupMemberships
  class SyncEntitlements
    include Dry::Monads[:result, :do]

    attr_reader :membership

    delegate :user, :user_group, to: :membership

    # @param [User] user
    # @return [Dry::Monads::Result]
    def call(membership)
      @membership = membership

      destroy_excess_entitlements
      create_missing_entitlements

      return Success()
    end

    def create_missing_entitlements
      subjects = entitlements_to_create.map { _1[:subject_type].constantize.find _1[:subject_id] }
      subjects.each do |subject|
        Entitlements::Create.run(
          subject:,
          target: user,
          entitling_entity: membership,
          scoped_roles: { read_access: true }
        )
      end
    end

    def destroy_excess_entitlements
      entitlements_to_destroy.map do |entitlement_hash|
        Entitlement.by_entitling_entity(membership).where(**entitlement_hash)
      end.reduce do |memo, query|
        memo.or(query)
      end&.destroy_all
    end

    def entitlements_to_create
      expected_entitlements - existing_entitlements
    end

    def entitlements_to_destroy
      existing_entitlements - expected_entitlements
    end

    def existing_entitlements
      @existing_entitlements ||= Entitlement.where(
        target: user,
        entitler: membership.to_upsertable_entitler(user_group: { id: user_group.id, name: user_group.name })
      ).map do |entitlement|
        { subject_type: entitlement.subject_type, subject_id: entitlement.subject_id }
      end
    end

    def expected_entitlements
      @expected_entitlements ||= user_group.entitleables.reload.map do |entitleable|
        { subject_type: entitleable.entitleable_type, subject_id: entitleable.entitleable_id }
      end
    end
  end
end
