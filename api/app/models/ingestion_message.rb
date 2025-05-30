# frozen_string_literal: true

# A message stored during resource ingestion to be later returned to the client
class IngestionMessage < ApplicationRecord
  belongs_to :ingestion
  validates :kind, :payload, presence: true
end
