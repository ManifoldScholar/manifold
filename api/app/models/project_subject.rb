# Tracks the relationship between projects and subjects
class ProjectSubject < ApplicationRecord

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Association
  belongs_to :project
  belongs_to :subject

  def to_s
    subject.title
  end

end
