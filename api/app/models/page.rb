# Model representing a page of content
class Page < ApplicationRecord
  include FriendlyId
  include TrackedCreator

  friendly_id :nav_title, use: :slugged

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true
end
