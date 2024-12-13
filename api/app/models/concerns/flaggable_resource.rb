# frozen_string_literal: true

# A concern that makes a model able to receive {Flag}s.
#
# @see FlagStatus
module FlaggableResource
  extend ActiveSupport::Concern

  included do
    has_many :flags, as: :flaggable, dependent: :destroy, inverse_of: :flaggable
    has_one :flag_status, as: :flaggable, inverse_of: :flaggable

    after_touch :refresh_flag_status_data!
  end

  # @param [User, AnonymousUser, nil] user
  def flagged_by?(user)
    return false unless user.kind_of?(User) && user.persisted?

    user.id.in?(flagger_ids)
  end

  # @return [void]
  def refresh_flag_status_data!
    reload_flag_status

    new_flag_data = flag_status&.to_data || FlagStatus::EMPTY_DATA

    update_columns(**new_flag_data)
  end

  # @see Flags#resolve!
  # @return [FlaggableResource]
  def resolve_flags!(**options)
    flags.sans_resolved.find_each do |flag|
      flag.resolve!(**options)
    end

    reload

    return self
  end

  module ClassMethods
    # @api private
    # @see Flags::RefreshStatusData
    # @return [Hash]
    def for_refresh_query
      {
        flaggable_type: connection.quote(model_name.name),
        table_name: quoted_table_name,
      }
    end
  end
end
