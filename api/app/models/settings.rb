class Settings < ApplicationRecord
  # Authority
  include Authority::Abilities

  validates :singleton_guard, inclusion: [0]
  merge_hash_attributes! :general

  # Attachments
  has_attached_file :press_logo,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:id/:style_:filename",
                    styles: {
                      default: ["x246", :png]
                    }
  validation = Rails.application.config.x.api[:attachments][:validations][:image]
  validates_attachment_content_type :press_logo, content_type: validation[:allowed_mime]
  validates_attachment_file_name :press_logo, matches: validation[:allowed_ext]

  def self.instance
    row = first
    raise ActiveRecord::RecordNotFound unless row
    row
  rescue ActiveRecord::RecordNotFound
    # slight race condition here, but it will only happen once
    row = Settings .new
    row.singleton_guard = 0
    row.save!
    row
  end

  def press_logo_url
    return nil if press_logo.url(:default).blank?
    ENV["API_URL"] + press_logo.url(:default)
  end

  def client
    Rails.application.config.x.client
  end

end
