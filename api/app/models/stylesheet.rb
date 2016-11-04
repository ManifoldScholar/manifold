# A stylesheet
class Stylesheet < ActiveRecord::Base

  # Associations
  belongs_to :text
  belongs_to :ingestion_source, optional: true

end
