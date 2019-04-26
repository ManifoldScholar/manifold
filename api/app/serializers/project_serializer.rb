# Provides a minimum serialization of a project model.
class ProjectSerializer < ApplicationSerializer

  meta(partial: true)

  attributes :title, :subtitle, :publication_date,
             :created_at, :updated_at, :download_url, :download_call_to_action,
             :avatar_styles, :hero_styles, :recently_updated, :updated, :slug,
             :avatar_color, :avatar_meta, :draft, :abilities,
             :subtitle_formatted, :title_formatted, :title_plaintext, :standalone

  has_many :creators, serializer: MakerSerializer

  def recently_updated
    object.recently_updated?
  end

  def updated
    object.updated?
  end

  def standalone
    object.standalone?
  end

end
