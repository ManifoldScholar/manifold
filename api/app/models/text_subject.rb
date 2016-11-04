# Tracks the relationship between texts and subjects
class TextSubject < ActiveRecord::Base

  # Association
  belongs_to :text
  belongs_to :subject

end
