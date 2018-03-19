# Provides a serialization of a resource model.
class SearchResultSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :score, :searchable_type, :searchable_id, :body, :highlighted_body,
             :title, :highlighted_title, :parents

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
    # object._type
  end

  def searchable_id
    object._id
  end

  def searchable_type
    object._type.camelize(:lower)
  end

  def score
    object._score
  end

  def parents
    message = "parents_for_#{object._type}"
    return send message if respond_to? message
    {}
  end

  def parents_for_text_section_child
    text_section = object.model.text_section
    {
      text_section: text_section_properties(text_section),
      text: text_properties(text_section&.text),
      project: project_properties(text_section&.project)
    }
  end
  alias parents_for_annotation parents_for_text_section_child
  alias parents_for_searchable_node parents_for_text_section_child

  def parents_for_project_child
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
