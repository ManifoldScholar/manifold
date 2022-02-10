require "securerandom"

# Volumes belong to Journals
class JournalVolume < ApplicationRecord

  include Authority::Abilities
  include TrackedCreator
  include SerializedAbilitiesFor
  include Filterable
  include Sluggable

  belongs_to :journal, counter_cache: true
  has_many :journal_issues, dependent: :nullify

  validates :journal_id, presence: true
  validates :number, presence: true

  scope :in_reverse_order, -> { order(number: :desc) }
  scope :in_order, -> { order(number: :asc) }

  def slug_candidates
    chunks = (persisted? ? id : SecureRandom.uuid).split("-")
    chunks.map { |chunk| "#{number}-#{chunk}" }
  end

  def published_issues
    journal_issues.published
  end

end
