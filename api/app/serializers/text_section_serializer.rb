# Serializes a Text Section model
class TextSectionSerializer < ApplicationSerializer
  meta(partial: true)

  attributes :id, :text_slug, :text_title, :name, :source_identifier, :kind
  belongs_to :text
  has_many :stylesheets

end
