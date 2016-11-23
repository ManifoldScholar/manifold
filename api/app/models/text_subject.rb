# Tracks the relationship between texts and subjects
class TextSubject < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Association
  belongs_to :text
  belongs_to :subject

end
