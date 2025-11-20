class UserGroupMembership < ApplicationRecord
  include ProvidesEntitlements

  belongs_to :user, inverse_of: :user_group_memberships
  belongs_to :user_group, inverse_of: :user_group_memberships

  belongs_to :identity, inverse_of: :user_group_memberships, optional: true
end
