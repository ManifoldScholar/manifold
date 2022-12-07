# frozen_string_literal: true

# Volumes belong to {Journal}s and are used to group {JournalIssue issues}.
class JournalVolume < ApplicationRecord
  include Authority::Abilities
  include TrackedCreator
  include SerializedAbilitiesFor
  include Filterable
  include Sluggable

  belongs_to :journal, counter_cache: true
  has_many :journal_issues, -> { in_reverse_order }, dependent: :nullify

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
