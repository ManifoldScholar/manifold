# frozen_string_literal: true

# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroup < ApplicationRecord
  include Authority::Abilities
  include Collector
  include CollectsReadingGroupEntries
  include Filterable
  include ReceivesEntitlements
  include SerializedAbilitiesFor
  include SoftDeletable
  include TrackedCreator

  resourcify

  attribute :course, ReadingGroups::CourseConfiguration.to_type

  belongs_to :reading_group_kind, optional: true, inverse_of: :reading_groups

  has_many :reading_group_memberships, dependent: :destroy, inverse_of: :reading_group
  has_many :moderators, -> { merge(ReadingGroupMembership.moderators) }, through: :reading_group_memberships, source: :user
  has_many :users, -> { merge(ReadingGroupMembership.active) }, through: :reading_group_memberships

  # We intentionally leave out the :dependent option here because we apply out own logic
  # to child annotations on reading group delete in the :update_annotations_privacy
  # before_destroy callback below.
  has_many_readonly :annotations

  has_one_readonly :reading_group_collection, inverse_of: :reading_group
  has_one_readonly :reading_group_count
  has_many_readonly :reading_group_visibilities
  has_many_readonly :reading_group_user_counts

  has_many :annotated_texts, -> { distinct.reorder(nil) }, through: :annotations, source: :text

  has_many :annotation_flags, through: :annotations, source: :flags

  has_many :reading_group_categories, -> { in_order }, inverse_of: :reading_group, dependent: :destroy

  collects_reading_group_entry! "ReadingGroupProject", categorized: true
  collects_reading_group_entry! "ReadingGroupResource", categorized: true
  collects_reading_group_entry! "ReadingGroupResourceCollection", categorized: true
  collects_reading_group_entry! "ReadingGroupText", categorized: true
  collects_reading_group_entry! "ReadingGroupTextSection", categorized: true
  collects_reading_group_entry! "ReadingGroupJournalIssue", categorized: true

  delegate :annotations_count, :highlights_count, :comments_count, :memberships_count, to: :reading_group_count

  validates :privacy, inclusion: { in: %w(public private anonymous) }
  validates :name, presence: true, spam: { if: :public?, type: "title" }
  validates :invitation_code, uniqueness: true, presence: true

  validate :maybe_prevent_public_group_creation!, on: :create, if: :public?

  before_validation :ensure_invitation_code
  before_validation :upcase_invitation_code
  before_destroy :update_annotations_privacy
  after_save :ensure_creator_membership

  scope :for_serialization, -> { includes(:reading_group_kind, :reading_group_count, reading_group_memberships: :user) }

  scope :by_keyword, ->(value) { build_keyword_scope(value) if value.present? }
  scope :with_sort_order, ->(value) { build_sort_order_scope(value) }
  scope :in_default_order, -> { order(created_at: :desc) }
  scope :with_order, ->(by = nil) { by.present? ? order(by) : in_default_order }
  scope :non_public, -> { where.not(privacy: "public") }
  scope :visible_to_public, -> { where(privacy: "public") }
  scope :with_privacy, ->(value = nil) { where(privacy: value) if value.present? }
  scope :visible_to, ->(user) do
    where(id: ReadingGroupVisibility.visible_to(user).select(:reading_group_id))
  end
  scope :with_flags, ->(value = nil) {
    if value.present?
      joins(:annotations)
        .where("annotations.unresolved_flags_count > 0")
        .distinct
    end
  }

  def private?
    privacy == "private"
  end

  def anonymous?
    privacy == "anonymous"
  end

  def public?
    privacy == "public"
  end

  # @param [User] user
  # @return [ReadingGroupMembership, nil]
  def reading_group_membership_for_user(user)
    return nil unless user

    reading_group_memberships.for_user(user).first
  end

  alias membership_for reading_group_membership_for_user

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
    reading_group_memberships.where(user: creator).first_or_create! do |rgm|
      rgm[:role] = :moderator
    end
  end

  private

  # @return [void]
  def maybe_prevent_public_group_creation!
    errors.add :base, :public_reading_groups_disabled if Settings.current.public_reading_groups_disabled?
  end

  class << self
    def build_keyword_scope(value)
      escaped = value.gsub("%", "\\%")

      needle = "%#{escaped}%"

      where arel_table[:name].matches(needle)
    end

    def build_sort_order_scope(value)
      values = value.split(",")

      return order(created_at: :asc) unless values.present?

      values.reduce(all) do |q, v|
        q.apply_sort_order_scope_value(v)
      end
    end

    def apply_sort_order_scope_value(value)
      case value
      when /\A(?<attr>created_at|name)(?:_(?<dir>asc|desc))\z/i
        dir = build_sort_order_direction(Regexp.last_match[:dir])

        attr = arel_table[Regexp.last_match[:attr]]

        order attr.public_send(dir)
      when /\Acourse_(?<key>(?:starts|ends)_on)(?:_(?<dir>asc|desc))\z/i
        dir = build_sort_order_direction(Regexp.last_match[:dir]).to_s.upcase

        expression = Arel.sql(<<~SQL.strip_heredoc.squish.strip)
        (course ->> '#{Regexp.last_match[:key]}')::date #{dir} NULLS LAST
        SQL

        order expression
      else
        all
      end
    end

    def build_sort_order_direction(value)
      /desc/i.match?(value) ? :desc : :asc
    end

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

    def soft_deletable_association?(assoc)
      assoc.klass == ::Annotation || super
    end
  end
end
