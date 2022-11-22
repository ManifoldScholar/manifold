module V1
  class SearchResultSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :score, Types::Float, &:_score
    typed_attribute :searchable_id, Types::Serializer::ID, &:_id
    typed_attribute :searchable_type, Types::String.meta(example: "textSection") do |object, _params|
      camelized_type(object)
    end
    typed_attribute :full_text, Types::String.optional
    typed_attribute :title, Types::String
    typed_attribute :keywords, Types::Array.of(Types::String)
    typed_attribute :parent_keywords, Types::Array.of(Types::String).optional
    typed_attribute :makers, Types::Array.of(Types::String)
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
      parents(object)
    end
    typed_attribute :text_nodes, Types::Hash.schema(
      total: Types::Integer,
      hits: Types::Array.of(
        Types::Hash.schema(
          content: Types::String,
          content_highlighted: Types::Array.of(Types::String),
          node_uuid: Types::String,
          position: Types::Integer
        )
      )
    ).optional do |object, _params|
      text_nodes(object)
    end
    typed_attribute :highlights, Types::Hash.schema(
      parent_keywords: Types::String.optional, # TOOD: check type
      keywords: Types::String.optional, # TOOD: check type
      makers: Types::String.optional, # TOOD: check type
      full_text: Types::String.optional, # TOOD: check type
      title: Types::String.optional # TOOD: check type
    ).optional do |object, _params|
      highlights(object)
    end

    typed_has_one :model, polymorphic: true

    class << self

      def camelized_type(object)
        object.search_result_type&.camelize(:lower)
      end

      def parents(object)
        message = "parents_for_#{object.search_result_type}"
        return send(message, object) if respond_to? message

        {}
      end

      def parents_for_text_section_child(object)
        text_section = object.model&.text_section
        return {} unless text_section.present?

        {
          text_section: text_section_properties(text_section),
          text: text_properties(text_section&.text),
          project: project_properties(text_section&.project)
        }
      end
      alias parents_for_annotation parents_for_text_section_child

      def parents_for_text_child(object)
        text = object.model&.text
        project = object.model&.project
        return {} unless text.present?

        {
          text: text_properties(text),
          project: project_properties(project)
        }
      end
      alias parents_for_text_section parents_for_text_child

      def parents_for_project_child(object)
        return {} unless object.model&.project.present?

        {
          project: project_properties(object.model.project)
        }
      end
      alias parents_for_text parents_for_project_child
      alias parents_for_resource parents_for_project_child
      alias parents_for_collection parents_for_project_child
      alias parents_for_event parents_for_project_child

      def project_properties(project)
        {
          title: project.title,
          slug: project.slug,
          id: project.id
        }
      end

      def text_section_properties(text_section)
        {
          title: text_section.name,
          id: text_section.id
        }
      end

      def text_properties(text)
        {
          title: text.title,
          slug: text.slug,
          id: text.id
        }
      end

      def text_nodes(object)
        results = object.dig("inner_hits", "text_nodes")
        return nil unless results

        camelize_hash(
          total: results.hits.total,
          hits: results.hits.hits.each_with_index.map do |hit, _index|
            {
              content: hit._source.content,
              content_highlighted: hit.highlight ? hit.highlight["text_nodes.content.analyzed"] : nil,
              nodeUuid: hit._source.node_uuid,
              position: hit._source.position
            }
          end
        )
      end

      def highlights(object)
        a = [:parent_keywords, :keywords, :makers, :full_text, :title].map do |k|
          [k, object.dig("highlight", "#{k}.analyzed")]
        end
        a.to_h
      end

    end

  end
end
