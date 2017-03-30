# Provides a serialization of an ingestion model.
class IngestionSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :state, :external_source_url, :log, :source_file_name, :ingestion_type,
             :available_events, :strategy, :text_id, :creator_id

  def available_events
    allowed = [:analyze, :reset, :process]
    actions = object.aasm.events.map(&:name)
    actions.select { |action| allowed.include?(action) }
  end

end
