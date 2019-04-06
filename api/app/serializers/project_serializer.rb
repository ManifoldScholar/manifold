# Provides a minimum serialization of a project model.
class ProjectSerializer < ApplicationSerializer

  meta(partial: true)

  attributes :title, :subtitle, :hashtag, :publication_date, :description,
             :created_at, :updated_at, :featured, :purchase_url, :purchase_price_money,
             :purchase_price_currency, :purchase_price, :purchase_call_to_action,
             :twitter_id, :instagram_id, :facebook_id, :hero_styles, :cover_styles,
             :avatar_styles, :recently_updated, :updated, :description_formatted, :slug,
             :resource_kinds, :resource_tags, :avatar_color, :avatar_meta, :draft,
             :abilities, :download_url, :download_call_to_action, :tag_list,
             :subtitle_formatted, :title_formatted, :title_plaintext, :dark_mode,
             :image_credits, :image_credits_formatted

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer
  has_many :content_blocks
  has_many :action_callouts

  def recently_updated
    object.recently_updated?
  end

  def updated
    object.updated?
  end

  def resource_tags
    object.resource_tags.sort
  end

  def content_blocks
    if current_user&.can_update? object
      object.content_blocks
    else
      object.content_blocks.visible
    end
  end

end
