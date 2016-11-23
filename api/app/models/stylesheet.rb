# A stylesheet
class Stylesheet < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :text
  belongs_to :ingestion_source, optional: true

end
