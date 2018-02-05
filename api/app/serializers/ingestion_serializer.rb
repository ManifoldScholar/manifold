# Provides a serialization of an ingestion model.
class IngestionSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :state, :external_source_url, :log, :source_file_name, :ingestion_type,
             :available_events, :strategy, :strategy_label, :text_id, :creator_id

  def available_events
    allowed = [:analyze, :reset, :process, :reingest]
    actions = object.aasm.events.map(&:name)
    actions.select { |action| allowed.include?(action) }
  end

end
