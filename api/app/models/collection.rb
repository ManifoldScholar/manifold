# A collection of resources
class Collection < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :project
  has_many :collection_resources,
           dependent: :destroy
  has_many :resources, through: :collection_resources

  # Attachments
  has_attached_file :thumbnail
  validation = Rails.configuration.manifold.attachments.validations.image
  validates_attachment_content_type :thumbnail, content_type: validation[:allowed_mime]
  validates_attachment_file_name :thumbnail, matches: validation[:allowed_ext]
  before_thumbnail_post_process :resize_images

  def thumbnail_url
    return nil unless thumbnail.present?
    Rails.configuration.manifold.api_url + thumbnail.url
  end

  def resource_kinds
    resources
      .select("resources.kind, collection_resources.position")
      .to_a.pluck(:kind)
      .uniq
  end

  def resource_tags
    resources
      .tag_counts
      .pluck(:name)
  end

  def to_s
    title
  end

end
