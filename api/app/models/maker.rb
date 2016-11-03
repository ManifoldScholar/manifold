# A person or organization involved with the creation of a text
class Maker < ActiveRecord::Base
  has_many :collaborators

  has_attached_file :avatar,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumb: ["x246", :png],
                      square: ["246x246#"]
                    }

  validates_attachment_content_type :avatar, content_type: %w(
    image/gif
    image/jpeg
    image/jpg
    image/png
    image/svg+xml
  )
  validates_attachment_file_name :avatar, matches: [
    /gif\Z/,
    /jpe?g\Z/,
    /png\Z/,
    /svg\Z/
  ]

  def avatar_url
    return nil if avatar.url(:square).blank?
    ENV["API_URL"] + avatar.url(:square)
  end

  def full_name
    [first_name, middle_name, last_name].reject(&:blank?).join(" ")
  end
end
