class ContentBlockReference < ApplicationRecord

  acts_as_list scope: [:content_block_id, :kind]

  default_scope { order(position: "ASC") }
  belongs_to :content_block
  belongs_to :referencable, polymorphic: true

  validates :kind, presence: true
end
