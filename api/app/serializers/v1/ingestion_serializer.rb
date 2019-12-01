module V1
  class IngestionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :state,
               :external_source_url,
               :log,
               :source_file_name,
               :ingestion_type,
               :available_events,
               :strategy,
               :strategy_label,
               :text_id,
               :creator_id

    attribute :available_events do |object, _params|
      allowed = [:analyze, :reset, :process, :reingest]
      actions = object.aasm.events.map(&:name)
      actions.select { |action| allowed.include?(action) }
    end

    has_one :creator, serializer: ::V1::UserSerializer

  end
end
