class UserDerivedRole < ApplicationRecord
  self.primary_key = :user_id

  belongs_to :user, inverse_of: :derived_role

  classy_enum_attr :role, enum: "RoleName", allow_blank: false, default: :reader
  classy_enum_attr :kind, enum: "RoleName", allow_blank: false, default: :reader

  scope :by_user, ->(user) { where(user: user) }
end
