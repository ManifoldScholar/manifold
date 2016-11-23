# A subject
class Subject < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Associations
  has_many :text_subjects
  has_many :project_subjects
  has_many :texts, through: :text_subjects
  has_many :projects, through: :project_subjects

  # Validations
  validates :name, presence: true

end
