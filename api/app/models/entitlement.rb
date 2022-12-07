# frozen_string_literal: true

class Entitlement < ApplicationRecord
  include Authority::Abilities
  include HasStateMachine
  include SerializedAbilitiesFor
  include Filterable

  classy_enum_attr :kind, enum: "EntitlementKind", allow_blank: false, default: :unknown

  has_state_machine! initial_state: :pending

  attribute :global_roles, Entitlements::GlobalRoleMapping.to_type
  attribute :scoped_roles, Entitlements::ScopedRoleMapping.to_type

  belongs_to :entitler, inverse_of: :entitlements
  belongs_to :target,   polymorphic: true
  belongs_to :subject, polymorphic: true

  has_one :entitling_user, through: :entitler, source: :entity, source_type: "User"

  has_many :entitlement_user_links, autosave: true, inverse_of: :entitlement, dependent: :destroy
  has_many :users, through: :entitlement_user_links, source: :user
  has_many :derived_roles, class_name: "EntitlementDerivedRole", inverse_of: :entitlement

  scope :active, -> { in_state(:active) }
  scope :by_target, ->(target) { where(target: target) }
  scope :expirable, -> { where.not(expires_on: nil) }
  scope :expired, -> { where.not(expired_at: nil) }
  scope :maybe_soon_to_expire, -> { expirable.in_state(:active) }

  scope :by_keyword, ->(keyword) {
                       joins("LEFT JOIN entitlement_targets et
                           ON et.target_type = entitlements.target_type
                           AND et.target_id = entitlements.target_id")
                         .where("lower(et.name) LIKE :prefix", prefix: "#{keyword}%".downcase)
                     }

  before_validation :infer_kind!
  after_save :check_state!
  after_create :link_users!

  validate :kind_must_be_known!
  validate :must_specify_correct_roles!
  validate :subject_is_entitleable!

  delegate :role_names, to: :global_roles, prefix: :global
  delegate :role_names, to: :scoped_roles, prefix: :scoped
  delegate :has_global_roles?, :has_scoped_roles?, :granted_role_names, to: :kind
  delegate :name, to: :target, prefix: true

  # @api private
  # @return [void]
  def check_state!
    expected_state = EntitlementState.fetch_for self

    return if current_state == expected_state
    return if expected_state.blank?

    transition_to! expected_state.to_sym
  end

  # @!attribute [r] expiration
  # @return [String, nil] a string representation of the date
  def expiration
    return nil unless expires_on?

    expires_on.to_s
  end

  # Predicate that tests if the entitlement's `subject` is a {Journal}
  #
  # @see #has_subject?
  def for_journal?
    has_subject? Journal
  end

  # Predicate that tests if the entitlement's `subject` is a {Project}
  #
  # @see #has_subject?
  def for_project?
    has_subject? Project
  end

  # Predicate that tests if the entitlement's `subject` is a {ProjectCollection}
  #
  # @see #has_subject?
  def for_project_collection?
    has_subject? ProjectCollection
  end

  # Predicate that tests if the entitlement's `subject` is a {SystemEntitlement}
  #
  # It optionally takes a block that can be used to validate against the instance
  # itself, e.g. to test the {SystemEntitlementKind}.
  #
  # @see #has_subject?
  def for_system_entitlement?
    return false unless has_subject? SystemEntitlement
    return true unless block_given?

    subject.instance_exec(subject, &Proc.new)
  end

  # @param [#===, nil] kind
  def has_subject?(kind = nil)
    return subject.present? if kind.blank?

    # rubocop:disable Style/CaseEquality
    kind === subject
    # rubocop:enable Style/CaseEquality
  end

  # @api private
  # @return [void]
  def link_users!
    linkable_users.each do |user|
      if new_record?
        entitlement_user_links.build user: user
      else
        # :nocov:
        user_link = EntitlementUserLink.new(entitlement: self, user: user)

        user_link.upsert!
        # :nocov:
      end
    end
  end

  # @return [<User>]
  def linkable_users
    case target
    when ReadingGroup then target.users
    when User then [target]
    end.to_a
  end

  # @yield [m]
  # @yieldparam [Dry::Matcher] m
  # @yieldreturn [object]
  def on_subject(&block)
    raise "Must provide a block" unless block_given?

    Entitlements::Subjects::Matcher.call(self, &block)
  end

  # @!attribute [r] subject_url
  # @return [String]
  def subject_url
    subject&.to_entitlement_gid&.to_s
  end

  # @!attribute [r] target_url
  # @return [String]
  def target_url
    target&.to_global_id&.to_s
  end

  private

  # @return [void]
  def infer_kind!
    self.kind = EntitlementKind.fetch_for self
  end

  # @return [void]
  def kind_must_be_known!
    errors.add :kind, "must be known" unless kind.known?
  end

  # @return [void]
  def must_specify_correct_roles!
    self.global_roles = {} unless has_global_roles?
    self.scoped_roles = {} unless has_scoped_roles?
    errors.add :global_roles, "must have at least one role specified" if has_global_roles? && global_roles.none?
    errors.add :scoped_roles, "must have at least one role specified" if has_scoped_roles? && scoped_roles.none?
  end

  # @return [void]
  def subject_is_entitleable!
    errors.add :subject, "is not supported" unless subject.is_a?(Entitleable)
  end

  module Expiration
    extend ActiveSupport::Concern

    # @!attribute [r] days_left
    # @return [Float]
    def days_left
      return Float::INFINITY unless expirable?

      difference_in_days expires_at, Time.current
    end

    # @!attribute [r] duration
    # @return [Float]
    def duration
      return Float::INFINITY unless expirable?

      difference_in_days expires_at, granted_at
    end

    def expirable?
      expires_on?
    end

    def expires_at
      expires_on&.at_end_of_day
    end

    def granted_at
      created_at.presence || Time.current
    end

    def has_expired?(at = Date.current)
      return false unless expirable?

      expires_on < at
    end

    def should_be_expiring_soon?
      return false unless expirable?
      return false if has_expired?

      case duration
      when -Float::INFINITY..0.0 then false
      when 0.0...7.0 then days_left < 3.0
      when 7.0...30.0 then days_left < 8.0
      else
        days_left < 31.0
      end
    end

    private

    def difference_in_days(final, start)
      diff = final - start

      diff /= 1.day

      diff.round(2).clamp(0.0, Float::INFINITY)
    end
  end

  include Expiration
end
