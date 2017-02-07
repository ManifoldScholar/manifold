# Provides a partial serialization of a text model.
class TextPartialSerializer < ActiveModel::Serializer
  # cache key: "text_partial", expires_in: 3.hours
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url, :created_at,
             :start_text_section_id, :published, :annotations_count, :highlights_count,
             :bookmarks_count, :age, :position, :publication_date, :spine, :rights

  belongs_to :project
  belongs_to :category

  def start_text_section_id
    object.start_text_section_id ||= object.spine[0]
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
