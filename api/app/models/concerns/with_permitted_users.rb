module WithPermittedUsers
  extend ActiveSupport::Concern

  included do
    has_many :permitted_users, lambda {
      joins(:roles)
        .where(roles: { name: Role::SCOPED_ROLES })
        .distinct
    }, through: :roles,
       foreign_key: :resource_id,
       source: :users

    scope :by_permitted_user, lambda { |user|
      joins(:permissions).where(permissions: { user: user }) if user.present?
    }

    after_create :grant_project_editor_role!
  end

  def permitted_users_for_role(role)
    permitted_users.joins(:roles).where(roles: { name: role })
  end

  def grant_project_editor_role!
    return unless creator&.project_creator?
    creator.add_role Role::ROLE_PROJECT_EDITOR, self
  end
end
