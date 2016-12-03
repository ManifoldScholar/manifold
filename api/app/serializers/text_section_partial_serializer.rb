# Serializes a Text Section model
class TextSectionPartialSerializer < ActiveModel::Serializer
  cache key: "text_section_partial", expires_in: 3.hours
  attributes :id, :name, :source_identifier, :kind

  def body_json
    find = "/system/ingestion_sources/attachments"
    replace = ENV["API_URL"] + find
    return "{}" if object.body_json.blank?
    JSON.parse object.body_json.gsub(find, replace)
  end

  belongs_to :text
end
