# Serializes a Text Section model
class TextSectionPartialSerializer < ActiveModel::Serializer
  attributes :id, :name, :source_identifier, :kind

  def body_json
    JSON.parse object.body_json
  end

  belongs_to :text
end
