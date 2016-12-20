# A person or organization involved with the creation of a text
class Maker < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Associations
  has_many :collaborators

  # Attachments
  has_attached_file :avatar,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumb: ["x246", :png],
                      square: ["246x246#"]
                    }
  validation = Rails.application.config.x.api[:attachments][:validations][:image]
  validates_attachment_content_type :avatar, content_type: validation[:allowed_mime]
  validates_attachment_file_name :avatar, matches: validation[:allowed_ext]

  validates :first_name, presence: true
  validates :last_name, presence: true

  def self.filtered(filters)
    makers = Maker.all
    return makers unless filters && filters.key?(:name)
    name_query = "(makers.first_name || ' ' || makers.last_name) ILIKE ?"
    makers.where(name_query, "#{filters[:name]}%")
  end

  def avatar_url
    return nil if avatar.url(:square).blank?
    ENV["API_URL"] + avatar.url(:square)
  end

  def full_name
    [first_name, middle_name, last_name].reject(&:blank?).join(" ")
  end

  def to_s
    full_name
  end

end
