# Volumes belong to Journals
class JournalIssue < ApplicationRecord

  include Authority::Abilities
  include TrackedCreator
  include SerializedAbilitiesFor
  include Filterable

  belongs_to :journal, counter_cache: true
  belongs_to :journal_volume, optional: true, counter_cache: true
  belongs_to :project

  validates :project_id, presence: true
  validates :project_id, uniqueness: true
  validates :journal_id, presence: true
  validates :number, presence: true

  include TrackedCreator

  scope :in_reverse_order, -> { order(number: :desc) }
  scope :in_order, -> { order(number: :asc) }

  delegate :avatar, to: :project
  delegate :avatar_color, to: :project
  delegate :avatar_meta, to: :project
  delegate :avatar_styles, to: :project
  delegate :cover_styles, to: :project
  delegate :hero_styles, to: :project
  delegate :publication_date, to: :project
  delegate :slug, to: :project, prefix: true
  delegate :number, to: :journal_volume, prefix: true, allow_nil: true
  delegate :content_blocks, to: :project, prefix: true
  delegate :content_block_ids, to: :project, prefix: true
  delegate :texts, to: :project, prefix: true
  delegate :text_ids, to: :project, prefix: true
  delegate :creators, to: :project
  delegate :creator_names, to: :project
  delegate :creator_ids, to: :project

end
