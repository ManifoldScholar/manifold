class ReadingGroupVisibility < ApplicationRecord
  include View

  belongs_to :reading_group
  belongs_to :reading_group_membership, optional: true
  belongs_to :user

  scope :by_user, ->(user) { user.present? ? where(user: user) : none }
  scope :archived, -> { where(archived: true) }
  scope :visible, -> { where(visible: true) }
  scope :joinable, -> { where(joinable: true) }
  scope :joined, -> { where(joined: true) }
  scope :reading_group_ids, -> { select(:reading_group_id) }
  scope :visible_to, ->(user) { by_user(user).visible }

  class << self
    # @param [User] user
    # @return [ActiveRecord::Relation]
    def joined_reading_group_ids_for(user)
      by_user(user).joined.reading_group_ids
    end

    # @param [User] user
    # @param [Boolean] joined
    # @return [ActiveRecord::Relation]
    def visible_or_joined_reading_group_ids_for(user, joined: false)
      joined ? joined_reading_group_ids_for(user) : visible_reading_group_ids_for(user)
    end

    # @param [User] user
    # @return [ActiveRecord::Relation]
    def visible_reading_group_ids_for(user)
      by_user(user).visible.reading_group_ids
    end
  end
end
