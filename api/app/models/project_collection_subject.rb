class ProjectCollectionSubject < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Association
  belongs_to :project_collection
  belongs_to :subject

  def to_s
    subject.title
  end

end
