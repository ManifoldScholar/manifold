# Tracks the relationship between projects and subjects
class ProjectSubject < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Association
  belongs_to :project
  belongs_to :subject

end
