# frozen_string_literal: true

class IngestionTargetKind < ClassyEnum::Base
  def ingest(user, ingestion)
    PaperTrail.request(whodunnit: user) do
      run_ingestion(ingestion)
    end
  end

  def reingest?(ingestion)
    ingestion.text.present?
  end

  def serialize(user, ingestion)
    serialization_options = { current_user: user }

    payload = V1::IngestionSerializer.new(
      ingestion,
      serialization_options
    ).serializable_hash

    ingestion.ingestion_messages.create!(kind: "entity", payload:)
  end

  def begin_processing(user, ingestion)
    serialize(user, ingestion)

    outcome = ingest(user, ingestion)
  rescue StandardError => e
    ingestion.handle_ingestion_exception(e)
  else
    return ingestion.handle_ingestion_exception(outcome.errors) unless outcome.valid?

    ingestion.info("\nIngestion Complete.")

    attach_record(ingestion, outcome.result)

    ingestion.processing_success
  end
end

class IngestionTargetKind::Text < IngestionTargetKind
  def run_ingestion(ingestion)
    Ingestions::Ingestor.run(ingestion:)
  end

  def attach_record(ingestion, result)
    ingestion.text = result
  end
end

class IngestionTargetKind::TextSection < IngestionTargetKind
  def run_ingestion(ingestion)
    text = ingestion.text

    Ingestions::TextSection::Ingestor.run(ingestion:, text:)
  end

  def reingest?(ingestion)
    ingestion.text_section.present?
  end

  def attach_record(ingestion, result)
    ingestion.text_section = result
  end
end
