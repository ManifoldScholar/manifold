# Tracks the relationship between users and makers
class UserClaim < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Association
  belongs_to :user
  belongs_to :maker

end
