class Subject < ActiveRecord::Base

  has_many :text_subjects
  has_many :texts, :through => :text_subjects

end
