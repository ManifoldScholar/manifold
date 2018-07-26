# Serializes a Text Section model
class TextSectionPartialSerializer < ApplicationSerializer
  meta(partial: true)

  attributes :id, :text_slug, :text_title, :name, :source_identifier, :kind
  belongs_to :text
  has_many :stylesheets

end
