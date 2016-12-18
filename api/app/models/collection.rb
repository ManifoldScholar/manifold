# A collection of resources
class Collection < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :project
  has_many :collection_resources,
           -> { order "collection_resources.position" },
           dependent: :destroy
  has_many :resources, through: :collection_resources

  # Attachments
  has_attached_file :thumbnail,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumb: ["x500", :jpg]
                    }
  validation = Rails.application.config.x.api[:attachments][:validations][:image]
  validates_attachment_content_type :thumbnail, content_type: validation[:allowed_mime]
  validates_attachment_file_name :thumbnail, matches: validation[:allowed_ext]

  def thumbnail_url
    return nil unless thumbnail.present?
    ENV["API_URL"] + thumbnail.url
  end

  def resource_kinds
    resources
      .select("resources.kind, collection_resources.position")
      .distinct
      .to_a.pluck(:kind)
  end

  def to_s
    title
  end

end
