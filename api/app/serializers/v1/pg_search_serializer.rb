# frozen_string_literal: true

module V1
  class PgSearchSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :score, Types::Float, &:pg_search_rank

    typed_attribute :searchable_id, Types::Serializer::ID

    typed_attribute :searchable_type, Types::String.meta(example: "textSection") do |object, _params|
      object.search_result_type.camelize(:lower)
    end

    typed_attribute :full_text, Types::String.optional

    typed_attribute :title, Types::String

    typed_attribute :keywords, Types::Array.of(Types::String) do
      []
    end

    typed_attribute :parent_keywords, Types::Array.of(Types::String).optional do
      nil
    end

    typed_attribute :makers, Types::Array.of(Types::String) do
      []
    end

    HighlightValues = Types::Array.of(Types::String).optional

    typed_attribute :highlights, Types::Hash.schema(
      parent_keywords: HighlightValues,
      keywords: HighlightValues,
      makers: HighlightValues,
      full_text: HighlightValues,
      title: HighlightValues
    ).optional do |object, _params|
      object.serialized_highlights
    end

    typed_attribute :parents, Types::Hash.schema(
      text: Types::Hash.schema(
        title: Types::String,
        slug: Types::String,
        id: Types::Serializer::ID
      ),
      project: Types::Hash.schema(
        title: Types::String,
        slug: Types::String,
        id: Types::Serializer::ID
      )
    ).optional do |object, _params|
      object.serialized_parents
    end

    typed_attribute :text_nodes, Types::Hash.schema(
      hits: Types::Array.of(
        Types::Hash.schema(
          content: Types::String,
          content_highlighted: HighlightValues,
          node_uuid: Types::String,
          position: Types::Integer
        )
      ),
      total: Types::Hash.schema(
        value: Types::Integer
      )
    ).optional do |object, params|
      object.load_text_node_hits_for!(params[:search_keyword])

      camelize_hash(object.text_nodes)
    end

    typed_has_one :model, polymorphic: true do |object|
      object.searchable
    end
  end
end
