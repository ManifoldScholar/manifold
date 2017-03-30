class IngestJob < ApplicationJob
  queue_as :default

  def perform(ingestion_id)
    ingestion = Ingestion.find(ingestion_id)
    Rails.logger.info("Found ingestion. State is: #{ingestion.state}")
    ingestion.ingest
  end
end
