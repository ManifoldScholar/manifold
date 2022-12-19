# frozen_string_literal: true

# A model that will turn into an {Entitlement} as soon as a {User}
# with a matching, verified `email` is created (or an existing user
# changes their email to the specified).
class PendingEntitlement < ApplicationRecord
  include Authority::Abilities
  include Filterable
  include HasStateMachine
  include ParsesExpiration
  include ProvidesEntitlements
  include SerializedAbilitiesFor
  include TrackedCreator

  has_state_machine! initial_state: :pending

  belongs_to :entitlement, optional: true
  belongs_to :user, optional: true
  belongs_to :subject, polymorphic: true

  has_one :entitlement_import_row, inverse_of: :pending_entitlement, dependent: :destroy

  strip_attributes only: %i[email first_name last_name]

  before_validation :set_default_creator!, unless: :creator_id?
  before_validation :set_name!, unless: :name?
  before_validation :maybe_map_subject_url!

  scope :by_email, ->(email) { where(arel_table[:email].matches("#{email}%")) if email.present? }
  scope :by_state, ->(state) { in_state(state) }
  scope :in_default_order, -> { order(created_at: :desc) }
  scope :pending_for_email, ->(email) do
    where(email: email, user: nil).in_state(:pending)
  end

  before_validation :parse_expiration!, if: :expiration_changed?

  after_create :create_or_wait!

  after_save :clear_subject_url!

  validates :name, :email, presence: true
  validates :email, email_format: true

  validate :maybe_map_subject_url!

  def ready_to_succeed?
    user.present? && subject.present? && entitlement.present?
  end

  # @!attribute [r] subject_url
  # @return [String]
  def subject_url
    subject&.to_entitlement_gid&.to_s
  end

  attr_writer :subject_url

  private

  # @return [void]
  def clear_subject_url!
    remove_instance_variable(:@subject_url) if instance_variable_defined?(:@subject_url)
  end

  # @see PendingEntitlements::CreateOrWait
  # @return [void]
  def create_or_wait!
    ManifoldApi::Container["pending_entitlements.create_or_wait"].(self).value!
  end

  # @return [void]
  def maybe_map_subject_url!
    return unless defined?(@subject_url)

    attempt = Entitlements::Types::ImportSubjectURI.try(@subject_url).to_monad

    Dry::Matcher::ResultMatcher.(attempt) do |m|
      m.success do |gid|
        self.subject = gid.find
      rescue ActiveRecord::RecordNotFound
        errors.add :subject_url, "is not found"
      end

      m.failure do
        errors.add :subject_url, "is invalid"
      end
    end
  end

  # @return [void]
  def set_default_creator!
    self.creator = User.cli_user unless creator_id?
  end

  # @return [void]
  def set_name!
    self.name = "Pending Entitlement (#{creator&.name})"
  end

  class << self
    # @param [ActiveRecord::Relation<PendingEntitlement>]
    def with_order(value = nil)
      case value
      when "expires_on_asc"
        order arel_nulls_last arel_table[:expires_on].asc
      when "expires_on_desc"
        order arel_nulls_last arel_table[:expires_on].desc
      else
        in_default_order
      end
    end
  end
end
