# Provides a partial serialization of a text model.
class TextPartialSerializer < ActiveModel::Serializer
  # cache key: "text_partial", expires_in: 3.hours
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url, :created_at,
             :first_section_id, :published, :annotations_count, :highlights_count,
             :bookmarks_count, :created_month, :created_year, :created_day, :age

  belongs_to :project
  belongs_to :category

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

  def first_section_id
    object.text_sections.first.try(:id)
  end

  def published
    object.published?
  end

  def age
    (Time.zone.today - object.created_at.to_date).to_i
  end

  def created_month
    object.created_at.strftime("%-m")
  end

  def created_year
    object.created_at.strftime("%-Y")
  end

  def created_day
    object.created_at.strftime("%-d")
  end

end
