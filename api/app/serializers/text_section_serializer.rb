# Serializes a Text Section model
class TextSectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :body_json, :source_identifier, :kind

  def body_json
    JSON.parse object.body_json
  end

  belongs_to :text
end
