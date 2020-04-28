module WithPermittedUsers
  extend ActiveSupport::Concern

  EDITOR_ROLES = RoleName.editor_roles.map(&:to_sym).freeze

  included do
    resourcify

    has_many :permitted_users, -> { joins(:roles).merge(Role.scoped).distinct }, through: :roles, foreign_key: :resource_id, source: :users

    scope :by_permitted_user, ->(user) { joins(:permissions).merge(Permission.by_user(user)) if user.present? }

    after_create :grant_project_editor_role!
  end

  def permitted_editors_and_authors
    permitted_users_for_role(EDITOR_ROLES + [RoleName::ProjectAuthor.new.to_sym])
  end

  def permitted_editors
    permitted_users_for_role EDITOR_ROLES
  end

  def permitted_users_for_role(role)
    permitted_users.joins(:roles).merge(Role.by_name(role))
  end

  def grant_project_editor_role!
    return unless creator&.project_creator?

    creator.add_role :project_editor, self
  end
end
