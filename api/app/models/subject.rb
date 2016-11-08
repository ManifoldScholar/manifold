# A subject
class Subject < ActiveRecord::Base

  # Associations
  has_many :text_subjects
  has_many :texts, through: :text_subjects

end
