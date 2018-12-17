class ContentBlockReference < ApplicationRecord
  belongs_to :content_block
  belongs_to :referencable, polymorphic: true

  validates :kind, presence: true
end
