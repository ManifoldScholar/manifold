# A resource is any asset our source document that is associated with a text.
class Resource < ActiveRecord::Base

  # Concerns
  include TrackedCreator

  # Associations
  belongs_to :project

  # Attachment Validation
  has_attached_file :attachment,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {}
  validation = Rails.application.config.x.api[:attachments][:validations][:resource]
  validates_attachment_content_type :attachment, content_type: validation[:allowed_mime]
  validates_attachment_file_name :attachment, matches: validation[:allowed_ext]

end
