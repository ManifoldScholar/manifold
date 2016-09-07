class Page < ApplicationRecord

  include FriendlyId
  friendly_id :nav_title, :use => :slugged

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

end
