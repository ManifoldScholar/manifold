class UserGroupEntitleable < ApplicationRecord
  belongs_to :user_group, inverse_of: :user_group_entitleables
  belongs_to :entitleable, polymorphic: true
end
