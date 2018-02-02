module AttributesForUser
  extend ActiveSupport::Concern

  included do
    attributes :id, :email, :nickname, :first_name, :last_name, :kind, :created_at,
               :role, :updated_at, :full_name, :avatar_styles, :persistent_ui
  end
end
