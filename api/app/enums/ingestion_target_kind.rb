class IngestionTargetKind < ClassyEnum::Base
  def ingest(user, ingestion)
    outcome = nil

    begin
      PaperTrail.request(whodunnit: user) do
        outcome = run_ingestion(ingestion)
      end
      outcome
    rescue StandardError => e
      return ingestion.handle_ingestion_exception(e)
    end
  end

  def reingest?(ingestion)
    ingestion.text.present?
  end

  def serialize(user, ingestion)
    serialization_options = { current_user: user }
    serialization = V1::IngestionSerializer.new(
      ingestion,
      serialization_options
    ).serializable_hash
    IngestionChannel.broadcast_to ingestion, type: "entity", payload: serialization
  end

  def begin_processing(user, ingestion)
    serialize(user, ingestion)

    outcome = ingest(user, ingestion)

    if outcome.valid?
      ingestion.info("\nIngestion Complete.")
      attach_record(ingestion, outcome.result)
      ingestion.processing_success
    else
      ingestion.handle_ingestion_exception(outcome.errors)
    end
  end
end

class IngestionTargetKind::Text < IngestionTargetKind
  def run_ingestion(ingestion)
    Ingestions::Ingestor.run ingestion: ingestion
  end

  def attach_record(ingestion, result)
    ingestion.text = result
  end
end

class IngestionTargetKind::TextSection < IngestionTargetKind
  def run_ingestion(ingestion)
    text = ingestion.text
    Ingestions::TextSection::Ingestor.run(ingestion: ingestion, text: text)
  end

  def reingest?(ingestion)
    ingestion.text_section.present?
  end

  def attach_record(ingestion, result)
    ingestion.text_section = result
  end
end
