# A subject
class Stylesheet < ActiveRecord::Base
  belongs_to :text
  belongs_to :ingestion_source, optional: true
end
