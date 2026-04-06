# frozen_string_literal: true

module Users
  # Upon deletion of a user, we want to clean up certain attached records
  # to ensure that some records get assigned a "Deleted User" classification
  # for their `creator`.
  #
  # @see User#prune_attached_records!
  # @see Users::AttachedRecordsPruner
  class AttachedRecordsPruner
    extend ActiveModel::Callbacks

    include Dry::Monads[:result]
    include Dry::Monads::Do.for(:call, :replace_creators_in_preserved_records!)
    include Dry::Initializer[undefined: false].define -> do
      param :user, ::Users::Types::User
    end

    PRESERVED_RECORDS = [
      ::Comment,
      ::EntitlementImport,
      ::Ingestion,
      ::Page,
      ::PendingEntitlement,
      ::Project,
      ::ReadingGroup,
      ::Resource,
      ::ResourceImport,
      ::Text,
    ].freeze

    define_model_callbacks :execute

    around_execute :wrap_in_transaction!

    # @return [User]
    attr_reader :deleted_user

    delegate :id, to: :deleted_user, prefix: true
    delegate :id, to: :user, prefix: :current_user

    # @return [Dry::Monads::Success(void)]
    def call
      prepare!

      run_callbacks :execute do
        yield purge_flags!

        yield prune_empty_reading_groups!

        yield replace_creators_in_preserved_records!
      end

      Success()
    end

    private

    # @return [void]
    def prepare!
      @deleted_user = User.deleted_user
    end

    # {Flag}s do not need to be preserved.
    #
    # @note We use `delete_all` here for efficiency and because the scheduled task
    #   {Flags::RefreshAllStatusData} will perform the necessary cleanup on flagged
    #   records.
    # @return [void]
    def purge_flags!
      user.created_flags.delete_all

      Success()
    end

    # This will prune all {ReadingGroup}s that currently only have the current {User}
    # {ReadingGroupMembership as a member}.
    #
    # @return [void]
    def prune_empty_reading_groups!
      with_current_membership = ReadingGroupMembership
        .where(user_id: current_user_id)
        .distinct
        .select(:reading_group_id)

      with_solo_memberships = ReadingGroupMembership
        .group(:reading_group_id)
        .having("COUNT(DISTINCT user_id) = 1")
        .select(:reading_group_id)

      reading_groups = ReadingGroup.existing.where(id: with_solo_memberships).where(id: with_current_membership)

      reading_groups.async_destroy_all

      Success()
    end

    # @return [Dry::Monads::Result]
    def replace_creators_in_preserved_records!
      PRESERVED_RECORDS.each do |record_klass|
        scope = record_klass.where(creator_id: current_user_id).existing

        yield replace_creator_within!(scope)
      end

      Success()
    end

    # @param [ActiveRecord::Relation<#creator>] scope
    # @return [Dry::Monads::Result]
    def replace_creator_within!(scope)
      scope.update_all(creator_id: deleted_user_id)

      Success()
    end

    # @return [void]
    def wrap_in_transaction!
      ApplicationRecord.transaction(requires_new: true) do
        yield
      end
    end
  end
end
