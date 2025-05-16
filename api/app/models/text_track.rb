class TextTrack < ApplicationRecord
  include Authority::Abilities
  include Attachments

  belongs_to :resource
  has_one :project, through: :resource

  delegate :project, to: :resource, allow_nil: true

  classy_enum_attr :kind, enum: "TextTrackKind", allow_blank: false

  validates :kind, presence: true
  validates :srclang, presence: true, if: -> { kind&.subtitles? }

  # See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#track_data_types
  validates :label, uniqueness: {
    scope: [:resource_id, :kind, :srclang],
    message: "combination of kind, srclang, and label must be unique per resource"
  }

  manifold_has_attached_file :cues, :resource, no_styles: true
end
