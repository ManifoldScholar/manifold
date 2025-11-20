class UserGroup < ApplicationRecord
  include Authority::Abilities
  include Filterable

  has_many :memberships, class_name: "UserGroupMembership", inverse_of: :user_group
  has_many :entitleables, class_name: "UserGroupEntitleable", inverse_of: :user_group

  has_many :users, through: :user_group_memberships

  validates :name, presence: true, uniqueness: true
end
