module V1
  class IngestionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :state, NilClass
    typed_attribute :external_source_url, NilClass
    typed_attribute :log, NilClass
    typed_attribute :source_file_name, NilClass
    typed_attribute :ingestion_type, NilClass
    typed_attribute :available_events, NilClass
    typed_attribute :strategy, NilClass
    typed_attribute :strategy_label, NilClass
    typed_attribute :text_id, NilClass
    typed_attribute :creator_id, NilClass
    typed_attribute :available_events, NilClass do |object, _params|
      allowed = [:analyze, :reset, :process, :reingest]
      actions = object.aasm.events.map(&:name)
      actions.select { |action| allowed.include?(action) }
    end

    typed_has_one :creator, serializer: ::V1::UserSerializer

  end
end
