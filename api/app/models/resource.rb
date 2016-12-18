# A resource is any asset our source document that is associated with a text.
class Resource < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator

  # Associations
  belongs_to :project
  has_many :collection_resources, dependent: :destroy
  has_many :collections, through: :collection_resources

  # Attachment Validation
  has_attached_file :attachment,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/resource/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumbnail: ["200x150#"]
                    }
  validation = Rails.application.config.x.api[:attachments][:validations][:resource]
  validates_attachment_content_type :attachment, content_type: validation[:allowed_mime]
  validates_attachment_file_name :attachment, matches: validation[:allowed_ext]

  before_attachment_post_process :resize_images

  def self.filtered(filters)
    resources = Resource.all
    return resources unless filters
    if filters.key? :project
      resources = resources.where(project: filters[:project])
    end
    resources
  end

  def attachment_is_image?
    config = Rails.application.config.x.api
    allowed = config[:attachments][:validations][:image][:allowed_mime]
    allowed.include?(attachment_content_type)
  end

  def attachment_url
    return nil unless attachment.present?
    ENV["API_URL"] + attachment.url
  end

  def attachment_thumbnail_url
    return nil unless attachment.present? && attachment.exists?(:thumbnail)
    ENV["API_URL"] + attachment.url(:thumbnail)
  end

  def resize_images
    res = attachment_is_image?
    res
  end

  def to_s
    title
  end

end
