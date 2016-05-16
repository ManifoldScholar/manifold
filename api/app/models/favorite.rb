# A favorite represents a user's decision to favorite an object, generally a project.
class Favorite < ActiveRecord::Base
  belongs_to :user
  belongs_to :favoritable, polymorphic: true
  validates :favoritable_id, uniqueness: { scope: [:user_id, :favoritable_type] }

  scope :only_projects, -> { where(favoritable_type: "Project") }
  scope :only_texts, -> { where(favoritable_type: "Text") }
end
