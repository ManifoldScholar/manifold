# Serializes a Text Section model
class TextSectionPartialSerializer < ActiveModel::Serializer
  cache key: "text_section_partial", expires_in: 3.hours
  attributes :id, :name, :source_identifier, :kind

  def body_json
    find = "/system/resources/attachments"
    replace = ENV["API_DOMAIN"] + find
    JSON.parse object.body_json.sub(find, replace)
  end

  belongs_to :text
end
