# frozen_string_literal: true

module WithConfigurableAvatar
  extend ActiveSupport::Concern

  AVATAR_COLOR_PRIMARY = "primary"
  AVATAR_COLOR_SECONDARY = "secondary"
  AVATAR_COLOR_TERTIARY = "tertiary"
  AVATAR_COLOR_QUATERNARY = "quaternary"
  AVATAR_COLOR_QUINARY = "quinary"
  AVATAR_COLOR_SENTARY = "sentary"
  AVATAR_COLORS = [
    AVATAR_COLOR_PRIMARY,
    AVATAR_COLOR_SECONDARY,
    AVATAR_COLOR_TERTIARY,
    AVATAR_COLOR_QUATERNARY,
    AVATAR_COLOR_QUINARY,
    AVATAR_COLOR_SENTARY
  ].freeze

  included do
    include Attachments
    manifold_has_attached_file :avatar, :image

    validates :avatar_color,
              presence: true,
              inclusion: { in: AVATAR_COLORS },
              unless: :avatar?
  end
end
