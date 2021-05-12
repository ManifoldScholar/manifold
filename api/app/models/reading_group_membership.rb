# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupMembership < ApplicationRecord
  upsert_keys %i[reading_group_id user_id]

  include AASM
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable

  ANONYMOUS_LABELS = [
    "Folio", "Bifolium", "Broadside", "Catchword", "Colophon",
    "Compositor", "Coucher", "Deckle", "Printer’s Devil", "Font",
    "Forme", "Typeface", "Incunabula", "Leaf", "Mould", "Paratext",
    "Recto", "Running-Title", "Shelfmark", "Quire", "Sheet", "Verso",
    "Watermark", "Witness", "Binding", "Boards", "Book Jacket",
    "Broadsheet", "Binding", "Conjugate Leaf", "Dust Jacket", "Edition",
    "End Paper", "Flyleaf", "Foxing", "Frontispiece", "Gathering",
    "Hinge", "Imprint", "Marbled Edge", "Octavo", "Presentation Copy",
    "Quarter Binding", "Quarto", "Slipcase", "Variant", "Wrapper",
    "Duodecimo", "Serif", "Engraving", "Intaglio", "Woodcut",
    "Lithograph"
  ].freeze

  classy_enum_attr :annotation_style, default: :solid, allow_blank: false
  classy_enum_attr :role, enum: "ReadingGroupRole", default: :member, allow_blank: false

  scope :moderators, -> { active.where(role: "moderator") }
  scope :for_user, ->(user) { where(user: user) }

  validates :user_id, uniqueness: { scope: :reading_group_id }

  belongs_to :user, optional: false
  belongs_to :reading_group, optional: false
  has_one :reading_group_membership_count

  delegate :full_name, to: :user, prefix: true
  delegate :anonymous?, to: :reading_group, prefix: true
  delegate :annotations_count, :comments_count, :highlights_count, to: :reading_group_membership_count, allow_nil: true
  delegate :moderator?, :member?, to: :role

  before_validation :ensure_anonymous_label
  after_save :ensure_user_roles!
  after_commit :enqueue_notification, on: [:create]
  after_create :create_entitlements!
  before_destroy :remove_entitlements!
  after_destroy :remove_user_roles!

  aasm do
    state :active, initial: true
    state :archived

    event :archive do
      transitions from: :active, to: :archived

      after do
        touch :archived_at
      end
    end

    event :activate do
      transitions from: :archived, to: :active

      after do
        update_column :archived_at, nil
      end
    end
  end

  def creator?
    reading_group.creator_id == user_id
  end

  def regenerate_anonymous_label
    self.anonymous_label = generate_anonymous_label
  end

  private

  # @return [void]
  def ensure_user_roles!
    if moderator? && active?
      user.add_role :moderator, reading_group
    else
      user.remove_role :moderator, reading_group
    end
  end

  # @return [void]
  def remove_user_roles!
    user.remove_role :moderator, reading_group if moderator?
  end

  # @return [void]
  def create_entitlements!
    ReadingGroupMemberships::CreateEntitlements.run! reading_group_membership: self
  end

  # @return [void]
  def remove_entitlements!
    ReadingGroupMemberships::RemoveEntitlements.run! reading_group_membership: self
  end

  def enqueue_notification
    return unless reading_group.notify_on_join
    return if reading_group.creator_id == user.id

    Notifications::SendReadingGroupJoinNotificationJob.perform_later(reading_group.creator_id, id)
  end

  def ensure_anonymous_label
    return if anonymous_label.present?

    self.anonymous_label = generate_anonymous_label
  end

  def generate_anonymous_label
    base_label = "Anonymous #{ANONYMOUS_LABELS.sample.titleize}"
    label = base_label
    i = 1
    while ReadingGroupMembership.exists?(anonymous_label: label, reading_group_id: reading_group_id)
      i += 1
      label = "#{base_label} ##{i}"
    end
    label
  end
end
