class PermissionSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :role_names

  belongs_to :user
  belongs_to :resource
end
