module V1
  class IngestionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :state, Types::String.enum("sleeping", "processing", "finished").meta(read_only: true)
    typed_attribute :external_source_url, Types::Serializer::URL.optional.meta(description: "Required if not uploading from a file")
    typed_attribute :log, Types::Array.of(Types::String).meta(read_only: true)
    typed_attribute :source_file_name, Types::String.optional.meta(read_only: true)
    typed_attribute :ingestion_type, Types::String.optional
    typed_attribute :strategy, Types::String.optional.meta(read_only: true)
    typed_attribute :strategy_label, Types::String.optional.meta(read_only: true)
    typed_attribute :text_id, Types::Serializer::ID.optional.meta(read_only: true)
    typed_attribute :text_section_id, Types::Serializer::ID.optional.meta(read_only: true)
    typed_attribute :creator_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :available_events, Types::Array.of(Types::String) do |object, _params|
      allowed = [:analyze, :reset, :process, :reingest]
      actions = object.aasm.events.map(&:name)
      actions.select { |action| allowed.include?(action) }
    end
    typed_attribute :target_kind, Types::String.enum("text", "text_section")

    typed_has_one :creator, serializer: ::V1::UserSerializer

  end
end
