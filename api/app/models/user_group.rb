# frozen_string_literal: true

class UserGroup < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable
  include ExternallyIdentifiable

  has_many :memberships, class_name: "UserGroupMembership", inverse_of: :user_group, dependent: :destroy
  has_many :entitleables, class_name: "UserGroupEntitleable", inverse_of: :user_group, dependent: :destroy

  has_many :users, through: :memberships

  validates :name, presence: true, uniqueness: true

  def entitlement_subjects
    entitleables.map(&:entitleable).compact
  end

  def sync_member_entitlements!
    UserGroups::SyncMemberEntitlements.new.call(self)
  end
end
