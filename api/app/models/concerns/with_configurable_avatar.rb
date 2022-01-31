module WithConfigurableAvatar
  extend ActiveSupport::Concern

  AVATAR_COLOR_PRIMARY = "primary".freeze
  AVATAR_COLOR_SECONDARY = "secondary".freeze
  AVATAR_COLOR_TERTIARY = "tertiary".freeze
  AVATAR_COLOR_QUATERNARY = "quaternary".freeze
  AVATAR_COLOR_QUINARY = "quinary".freeze
  AVATAR_COLOR_SENTARY = "sentary".freeze
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
