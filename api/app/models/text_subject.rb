# Tracks the relationship between texts and subjects
class TextSubject < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Association
  belongs_to :text
  belongs_to :subject

  def to_s
    subject.title
  end

end
