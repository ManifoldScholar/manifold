class TextTrack < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Attachments

  belongs_to :resource
  has_one :project, through: :resource

  delegate :project, to: :resource, allow_nil: true

  classy_enum_attr :kind, enum: "TextTrackKind", allow_blank: false

  validates :kind, presence: true
  validate :validate_label_uniqueness
  validate :validate_subtitles_has_language

  manifold_has_attached_file :cues, :resource, no_styles: true

  private

  # See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#track_data_types
  def validate_label_uniqueness
    return unless label.present?

    if TextTrack.where(resource: resource, kind: kind, srclang: srclang, label: label)
        .where.not(id: id)
        .exists?
      errors.add(:label, "must be unique per kind, language combination")
    end
  end

  def validate_subtitles_has_language
    if kind&.subtitles? && srclang.blank?
      errors.add(:srclang, "is required when kind is subtitles")
    end
  end
end
