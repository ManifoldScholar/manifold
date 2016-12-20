# Tracks the relationship between texts and subjects
class TextSubject < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Association
  belongs_to :text
  belongs_to :subject

  def to_s
    subject.title
  end

end
