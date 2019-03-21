# Provides a serialization of a resource model.
class SearchResultSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :score, :searchable_type, :searchable_id, :full_text, :title, :parents,
             :text_nodes, :keywords, :parent_keywords, :makers, :highlights

  has_one :model

  def read_attribute_for_serialization(attr)
    if respond_to?(attr)
      send(attr)
    else
      object[attr.to_s]
    end
  end

  def _type
    "search_result"
  end

  def highlights
    a = [:parent_keywords, :keywords, :makers, :full_text, :title].map do |k|
      [k, object.dig("highlight", "#{k}.analyzed")]
    end
    a.to_h
  end

  def searchable_id
    object._id
  end

  def searchable_type
    object._type.camelize(:lower)
  end

  # rubocop:disable Metrics/AbcSize
  def text_nodes
    results = object.dig("inner_hits", "text_nodes")
    return nil unless results

    {
      total: results.hits.total,
      hits: results.hits.hits.each_with_index.map do |hit, _index|
        {
          content: hit._source.content,
          content_highlighted: hit.highlight ? hit.highlight["text_nodes.content.analyzed"] : nil,
          nodeUuid: hit._source.node_uuid,
          position: hit._source.position
        }
      end
    }
  end
  # rubocop:enable Metrics/AbcSize

  def score
    object._score
  end

  def parents
    message = "parents_for_#{object._type}"
    return send message if respond_to? message

    {}
  end

  def parents_for_text_section_child
    text_section = object.model&.text_section
    return {} unless text_section.present?

    {
      text_section: text_section_properties(text_section),
      text: text_properties(text_section&.text),
      project: project_properties(text_section&.project)
    }
  end
  alias parents_for_annotation parents_for_text_section_child

  def parents_for_text_child
    text = object.model&.text
    project = object.model&.project
    return {} unless text.present?

    {
      text: text_properties(text),
      project: project_properties(project)
    }
  end
  alias parents_for_text_section parents_for_text_child

  def parents_for_project_child
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
end
