# Provides a partial serialization of a text model.
class TextPartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :id, :title, :creator_names, :unique_identifier, :cover_url, :created_at,
             :start_text_section_id, :published, :annotations_count, :highlights_count,
             :bookmarks_count, :age, :position, :publication_date, :spine, :rights,
             :sections_map

  belongs_to :project
  belongs_to :category

  def start_text_section_id
    object.start_text_section_id ||= object.spine[0]
  end

  def sections_map
    sections_ids = object.spine & object.text_sections.pluck(:id)
    sections_ids.map { |id| Hash[id: id.to_s, name: object.text_sections.find(id).name] }
  end

  def annotations_count
    object.annotations.only_annotations.created_by(scope).count
  end

  def highlights_count
    object.annotations.only_highlights.created_by(scope).count
  end

  # TODO: Implement bookmarks
  def bookmarks_count
    0
  end

  def published
    object.published?
  end

  def age
    (Time.zone.today - object.created_at.to_date).to_i
  end

end
