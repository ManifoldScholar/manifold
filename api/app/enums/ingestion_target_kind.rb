class IngestionTargetKind < ClassyEnum::Base

  def reingest?(ingestion)
    ingestion.text.present?
  end

  # rubocop:disable Metrics/MethodLength
  def begin_processing(user, ingestion)
    serialization_options = { current_user: user }
    serialization = V1::IngestionSerializer.new(
      ingestion,
      serialization_options
    ).serializable_hash
    IngestionChannel.broadcast_to ingestion, type: "entity", payload: serialization

    outcome = nil

    begin
      PaperTrail.request(whodunnit: user) do
        outcome = Ingestions::Ingestor.run ingestion: ingestion
      end
      outcome
    rescue StandardError => e
      return ingestion.handle_ingestion_exception(e)
    end

    if outcome.valid?
      ingestion.info("\nIngestion Complete.")
      ingestion.text = outcome.result
      ingestion.processing_success
    else
      ingestion.handle_ingestion_exception(outcome.errors)
    end
  end
  # rubocop:enable Metrics/MethodLength
end

class IngestionTargetKind::Text < IngestionTargetKind
end

class IngestionTargetKind::TextSection < IngestionTargetKind
  def reingest?(ingestion)
    ingestion.text_section.present?
  end

  # rubocop:disable Metrics/MethodLength
  def begin_processing(user, ingestion)
    serialization_options = { current_user: user }
    serialization = V1::IngestionSerializer.new(
      ingestion,
      serialization_options
    ).serializable_hash
    IngestionChannel.broadcast_to ingestion, type: "entity", payload: serialization

    outcome = nil

    begin
      PaperTrail.request(whodunnit: user) do
        text = ingestion.text
        outcome = Ingestions::TextSection::Ingestor.run(ingestion: ingestion, text: text)
      end
      outcome
    rescue StandardError => e
      return ingestion.handle_ingestion_exception(e)
    end

    if outcome.valid?
      ingestion.info("\nIngestion Complete.")
      ingestion.text_section = outcome.result
      ingestion.processing_success
    else
      ingestion.handle_ingestion_exception(outcome.errors)
    end
  end
  # rubocop:enable Metrics/MethodLength

end
