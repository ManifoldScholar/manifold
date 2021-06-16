module V1
  class ReadingGroupKindSerializer < ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    typed_attribute :name, Types::String
  end
end
