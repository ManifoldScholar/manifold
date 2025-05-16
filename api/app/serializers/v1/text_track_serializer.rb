module V1
  class TextTrackSerializer < ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    typed_attribute :id, Types::Serializer::ID
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :resource_id, Types::Serializer::ID
    typed_attribute :kind, Types::String
    typed_attribute :srclang, Types::String.optional
    typed_attribute :label, Types::String.optional
    typed_attribute :cues_content_type, Types::String.optional.meta(read_only: true)
    typed_attribute :cues_file_name, Types::String.optional.meta(read_only: true)
    typed_attribute :cues_file_size, Types::String.optional.meta(read_only: true)
    typed_attribute :cues_url, Types::String.optional.meta(read_only: true)
  end
end
