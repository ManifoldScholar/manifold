# Tracks the relationship between projects and subjects
class ProjectSubject < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Association
  belongs_to :project
  belongs_to :subject

  # Scopes
  scope :by_subject, ->(subject) { where(subject: subject) if subject.present? }

  def to_s
    subject.title
  end

end
