# A favorite represents a user's decision to favorite an object, generally a project.
class Favorite < ActiveRecord::Base

  # Associations
  belongs_to :user
  belongs_to :favoritable, polymorphic: true
  validates :favoritable_id, uniqueness: { scope: [:user_id, :favoritable_type] }
  validates :user, presence: true

  # Scopes
  scope :only_projects, -> { where(favoritable_type: "Project") }
  scope :only_texts, -> { where(favoritable_type: "Text") }

  def project
    return favoritable if favoritable.instance_of?(Project)
    return favoritable.project if favoritable.respond_to?(:project)
    nil
  end
end
