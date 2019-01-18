# Provides a minimum serialization of a text model.
class TextSerializer < ApplicationSerializer
  meta(partial: true)

  attributes :title, :creator_names, :created_at, :start_text_section_id,
             :published, :annotations_count, :highlights_count, :bookmarks_count,
             :age, :position, :publication_date, :cover_styles, :subtitle,
             :slug, :section_kind, :title_formatted, :title_plaintext,
             :subtitle_formatted, :subtitle_plaintext

  belongs_to :project
  belongs_to :category

  def start_text_section_id
    object.start_text_section_id || object.spine[0] || object.text_sections.first.try(:id)
  end

  def sections_map
    sections_ids = object.spine & object.text_sections.pluck(:id)
    sections_ids.map { |id| Hash[id: id.to_s, name: object.text_sections.find(id).name] }
  end

  def annotations_count
    object.annotations.only_annotations.count
  end

  def highlights_count
    object.annotations.only_highlights.count
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
