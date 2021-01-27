# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroup < ApplicationRecord

  include Authority::Abilities
  include ReceivesEntitlements
  include SerializedAbilitiesFor
  include TrackedCreator

  has_many :reading_group_memberships, dependent: :destroy
  has_many :users, through: :reading_group_memberships
  # We intentionally leave out the :dependent option here because we apply out own logic
  # to child annotations on reading group delete in the :update_annotations_privacy
  # before_destroy callback below.
  has_many :annotations

  has_one :reading_group_count

  has_many :annotated_texts, -> { distinct.reorder(nil) }, through: :annotations, source: :text

  delegate :annotations_count, to: :reading_group_count
  delegate :highlights_count, to: :reading_group_count

  validates :privacy, inclusion: { in: %w(public private anonymous) }
  validates :name, presence: true
  validates :invitation_code, uniqueness: true, presence: true

  before_validation :ensure_invitation_code
  before_validation :upcase_invitation_code
  before_save :ensure_creator_membership
  before_destroy :update_annotations_privacy

  scope :with_order, ->(by = nil) { by.present? ? order(by) : order(created_at: :desc) }
  scope :non_public, -> { where.not(privacy: "public") }
  scope :visible_to_public, -> { where(privacy: "public") }

  def private?
    privacy == "private"
  end

  def anonymous?
    privacy == "anonymous"
  end

  def public?
    privacy == "public"
  end

  def update_annotations_privacy
    # Use of update_all is intentional. We don't care about validations here.
    annotations.update_all(private: true, reading_group_id: nil) if private? || anonymous?
    annotations.update_all(private: false, reading_group_id: nil) if public?
  end

  def ensure_invitation_code
    return if invitation_code.present?

    self.invitation_code = generate_invitation_code
  end

  def upcase_invitation_code
    self.invitation_code = invitation_code.upcase
  end

  def generate_invitation_code
    code = SecureRandom.base64(6).tr("+/=", "0aZ")
    ReadingGroup.exists?(invitation_code: code) ? generate_invitation_code : code
  end

  def ensure_creator_membership
    users << creator unless users.include? creator
  end

  class << self
    # @param [String] code
    # @raise [ActiveRecord::RecordNotFound]
    # @return [ReadingGroup]
    def by_invitation_code(code)
      query = code.present? ? where(invitation_code: code.upcase) : none

      query.first!
    end

    def arel_id_is_null_or_within_scope(scope)
      arel_table[:id].eq(nil).or(arel_table[:id].in(Arel.sql(scope.to_sql)))
    end
  end
end
