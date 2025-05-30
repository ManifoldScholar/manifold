# frozen_string_literal: true

module V1
  class ReadingGroupCollectionSerializer < V1::ManifoldSerializer
    include V1::Concerns::ManifoldSerializer

    serialize_collection_attributes!
  end
end
