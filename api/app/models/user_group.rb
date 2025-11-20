class UserGroup < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable
  include ExternallyIdentifiable
  include SerializedAbilitiesFor

  has_many :memberships, class_name: "UserGroupMembership", inverse_of: :user_group
  has_many :user_group_entitleables, inverse_of: :user_group

  has_many :users, through: :user_group_memberships
  # has_many :entitleables, through: :user_group_entitleables, source_type: Entitleable

  validates :name, presence: true, uniqueness: true
end
