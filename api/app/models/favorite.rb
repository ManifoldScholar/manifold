# A favorite represents a user's decision to favorite an object, generally a project.
class Favorite < ApplicationRecord

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  # Associations
  belongs_to :user
  belongs_to :favoritable, polymorphic: true
  validates :favoritable_id, uniqueness: { scope: [:user_id, :favoritable_type] }
  validates :user, presence: true

  # This makes the favorite authorizer a bit simpler.
  alias_attribute :creator, :user

  # Scopes
  scope :only_projects, -> { where(favoritable_type: "Project") }
  scope :only_texts, -> { where(favoritable_type: "Text") }

  def project
    return favoritable if favoritable.instance_of?(Project)
    return favoritable.project if favoritable.respond_to?(:project)
    nil
  end

  def to_s
    "favorite #{id}"
  end

  def favorite_subjects
    user.favorites
        .where(favoritable_type: "Project")
        .joins("JOIN projects ON favorites.favoritable_id = projects.id")
        .joins("JOIN project_subjects ON project_subjects.project_id = projects.id")
        .pluck(:subject_id, :favoritable_id)
  end

end
