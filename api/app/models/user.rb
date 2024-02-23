# The User model
class User < ApplicationRecord
  TYPEAHEAD_ATTRIBUTES = [:title, :first_name, :last_name, :email].freeze

  include Authority::Abilities
  include Authority::UserAbilities
  include Collector
  include SerializedAbilitiesOn
  include SerializedAbilitiesFor
  include NotificationPreferences
  include ProvidesEntitlements
  include ReceivesEntitlements
  include Filterable
  include Recoverable
  include Attachments
  include WithParsedName
  include SearchIndexable

  classy_enum_attr :role, enum: "RoleName", allow_blank: false, default: :reader
  classy_enum_attr :kind, enum: "RoleName", allow_blank: false, default: :reader

  rolify after_add: :recalculate_role_derivations!, after_remove: :recalculate_role_derivations!

  has_many :identities, inverse_of: :user, autosave: true, dependent: :destroy
  has_many :annotations, -> { sans_orphaned_from_text }, foreign_key: "creator_id", dependent: :destroy,
           inverse_of: :creator
  has_many :annotated_texts, -> { distinct }, through: :annotations, source: :text
  has_many :favorites
  has_many :favorite_projects, through: :favorites, source: :favoritable,
           source_type: "Project"
  has_many :favorite_texts, through: :favorites, source: :favoritable, source_type: "Text"
  has_many :created_texts, class_name: "Text", foreign_key: "creator_id",
           dependent: :nullify, inverse_of: :creator
  has_many :created_projects, class_name: "Project", foreign_key: "creator_id",
           dependent: :nullify, inverse_of: :creator
  has_many :created_resources, class_name: "Resource", foreign_key: "creator_id",
           dependent: :nullify, inverse_of: :creator
  has_many :created_pages, class_name: "Page", foreign_key: "creator_id",
           dependent: :nullify, inverse_of: :creator
  has_many :created_flags, class_name: "Flag", foreign_key: "creator_id",
           dependent: :destroy, inverse_of: :creator
  has_many :reading_group_memberships, dependent: :destroy
  has_many :reading_groups, -> { merge(ReadingGroupMembership.active) }, through: :reading_group_memberships
  has_many :archived_reading_groups, -> { merge(ReadingGroupMembership.archived) },
           through: :reading_group_memberships, source: :reading_group
  has_many :reading_group_visibilities
  has_many :reading_group_user_counts
  has_many :visible_reading_groups, -> { merge(ReadingGroupVisibility.visible) },
           through: :reading_group_visibilities, source: :reading_group
  has_many :entitlement_user_links, inverse_of: :user, dependent: :destroy
  has_many :granted_entitlements, through: :entitlement_user_links, source: :entitlement
  has_many :permissions

  has_one :user_collection, inverse_of: :user

  has_many_collectables!

  has_one :derived_role, inverse_of: :user, class_name: "UserDerivedRole"

  validates :password, length: { minimum: 8 }, allow_nil: true, confirmation: true
  validate :password_not_blank!
  validates :email, presence: true
  validates :email, uniqueness: true, email_format: { message: "is not valid" }
  validates :first_name, :last_name, presence: true

  before_validation :infer_established!
  before_validation :infer_kind!
  before_validation :infer_role!
  before_validation :infer_trusted!

  after_save :sync_global_role!, if: :saved_change_to_role?
  after_save :prepare_email_confirmation!, if: :saved_change_to_email?
  after_touch :synchronize_established!

  # Attachments
  manifold_has_attached_file :avatar, :image

  # Misc
  composed_of :persistent_ui,
              class_name: "PersistentUI",
              mapping: [%i(raw_persistent_ui preferences)],
              converter: ->(raw_persistent_ui) { PersistentUI.new(raw_persistent_ui) }
  with_parsed_name :first_name, :last_name
  has_secure_password

  # Scopes
  scope :by_email, ->(email) { where(arel_table[:email].matches("#{email}%")) if email.present? }
  scope :with_order, ->(by) do
    return order(:last_name, :first_name) unless by.present?

    order(by)
  end
  scope :by_role, ->(role) { RoleName[role].then { |r| with_role(r.to_sym) if r.present? } }
  scope :by_cached_role, ->(*role) { where(role: role) }
  scope :email_confirmed, -> { where.not(email_confirmed_at: nil) }
  scope :email_unconfirmed, -> { where(email_confirmed_at: nil) }

  scope :established, -> { where(established: true) }
  scope :unestablished, -> { where(established: false) }
  scope :trusted, -> { where(trusted: true) }
  scope :untrusted, -> { where(trusted: false) }

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  delegate *RoleName.global_predicates, to: :role
  delegate *RoleName.scoped_predicates, to: :kind

  # @!attribute [rw] admin_verified
  # @return [Boolean]
  def admin_verified
    verified_by_admin_at?
  end

  alias admin_verified? admin_verified

  def admin_verified=(value)
    self.verified_by_admin_at = ManifoldApi::Container["utility.booleanize"].(value) ? Time.current : nil
  end

  # @!attribute [r] email_confirmed
  # @return [Boolean]
  def email_confirmed
    email_confirmed_at?
  end

  alias email_confirmed? email_confirmed

  def search_data
    {
      search_result_type: search_result_type,
      title: full_name,
      first_name: first_name,
      last_name: last_name,
      email: email,
      keywords: [role],
      hidden: true
    }
  end

  def email=(value)
    super(value.try(:strip))
  end

  def project_author_of?(resource)
    has_role? :project_author, resource
  end

  def project_editor_of?(resource)
    has_role? :project_editor, resource
  end

  def project_resource_editor_of?(resource)
    has_role? :project_resource_editor, resource
  end

  # @return [Favorite]
  def favorite(favoritable)
    collect_model!(favoritable).favorite
  end

  def favorite?(favoritable)
    favoritable = favoritable.favoritable if favoritable.is_a?(Favorite)

    collectable_scope_for(favoritable).exists?
  end

  def to_s
    name
  end

  def force_reset_password
    self.password = SecureRandom.hex(6)
  end

  def send_welcome_email
    AccountMailer.welcome(self, created_by_admin: false).deliver
  end

  def created?(resource)
    return false unless resource.respond_to? :creator

    resource.creator == self
  end

  def consent_complete?
    return false if consent_needed_terms_and_conditions?
    return false if consent_needed_google_analytics?

    consent_needed_manifold_analytics?
  end

  def consent_needed_terms_and_conditions?
    Settings.require_terms_and_conditions? && terms_and_conditions_accepted_at.blank?
  end

  def consent_needed_google_analytics?
    Settings.google_analytics_enabled? && consent_google_analytics.nil?
  end

  def consent_needed_manifold_analytics?
    Settings.google_analytics_enabled? && consent_manifold_analytics.nil?
  end

  # @param [ReadingGroup]
  # @return [ReadingGroupUserCount, nil]
  def reading_group_count_for(reading_group)
    reading_group_user_counts.then do |counts|
      count =
        if counts.loaded?
          counts.detect { |c| c.reading_group_id == reading_group.id }
        else
          counts.all.detect { |c| c.reading_group_id == reading_group.id }
        end

      attrs = count.present? ? count.as_json : {}

      Users::ReadingGroupCount.new attrs
    end
  end

  # @api private
  # @return [void]
  def clear_email_confirmation!
    ManifoldApi::Container["users.clear_email_confirmation"].(self).value!
  end

  # @api private
  # @return [void]
  def mark_email_confirmed!
    ManifoldApi::Container["users.mark_email_confirmed"].(self).value!
  end

  # @api private
  # @return [void]
  def prepare_email_confirmation!
    ManifoldApi::Container["users.prepare_email_confirmation"].(self).value!
  end

  # @api private
  # @return [void]
  def request_email_confirmation!
    ManifoldApi::Container["users.request_email_confirmation"].(self).value!
  end

  # @api private
  # @return [void]
  def sync_global_role!
    @synchronizing_global_role = true

    roles_to_remove = RoleName.globals(without: role)

    roles_to_remove.each do |role|
      remove_role role.to_sym
    end

    add_role role.to_sym
    infer_kind!
    update_column :kind, kind if kind_changed?
    synchronize_trusted!(force: true)
  ensure
    @synchronizing_global_role = false
  end

  class << self
    # @param [#project] subject
    # @return [ActiveRecord::Relation<User>]
    def receiving_comment_notifications_for(subject)
      project = nil
      project = subject.project if subject.respond_to?(:project)
      project = subject if subject.is_a? Project
      ids = project.present? ? project.permitted_editors_and_authors.select(:id) : []
      by_cached_role(:admin, :editor).or(unscoped.where(id: ids))
    end
  end

  private

  # @return [Boolean]
  def calculate_established
    verified_by_admin_at? || email_confirmed?
  end

  # @return [Boolean]
  def calculate_trusted
    has_any_role?(:admin, :editor, :moderator, :marketeer) || has_role?(:project_editor, :any)
  end

  # @return [void]
  def infer_established!
    self.established = calculate_established
  end

  # @see RoleName.fetch_for_kind
  # @return [void]
  def infer_kind!
    self.kind = RoleName.fetch_for_kind self
  end

  # @see RoleName#applies_to?
  # @return [void]
  def infer_role!
    self.role = RoleName.fetch_for(self) unless will_save_change_to_role?
  end

  # @return [void]
  def infer_trusted!
    self.trusted = calculate_trusted
  end

  # @param [Role] role
  # @return [void]
  def recalculate_role_derivations!(role)
    synchronize_kind! role
    synchronize_trusted!
  end

  # @return [void]
  def synchronize_established!
    update_column :established, calculate_established
  end

  # @param [Role] role
  # @return [void]
  def synchronize_kind!(role)
    sync_notification_preferences! role

    return if @synchronizing_global_role

    updates = {}

    updates[:role] = RoleName.fetch_for(self) if role.global?
    updates[:kind] = RoleName.fetch_for_kind(self) if role.global? || role.scoped?

    update_columns updates if updates.any?
  end

  # @return [void]
  def synchronize_trusted!(force: false)
    return if !force && @synchronizing_global_role

    update_column :trusted, calculate_trusted
  end

  def password_not_blank!
    return if password.nil?

    errors.add(:password, "can't be blank") if password.blank?
  end

  concerning :Classification do
    included do
      include ClassyEnum::ActiveRecord

      classy_enum_attr :classification, enum: "UserClassification", allow_blank: false

      delegate :anonymous?, :cli?, :command_line?, to: :classification
    end

    def default_classification?
      classification.default?
    end

    def unique_classification?
      classification.unique?
    end

    class_methods do
      def classification?(value)
        value.in? UserClassification
      end

      def anonymous_user(&block)
        fetch_by_classification :anonymous, &block
      end

      def cli_user(&block)
        fetch_by_classification :command_line, &block
      end

      def testing_user(&block)
        fetch_by_classification :testing, &block
      end

      # @api private
      # @param [Symbol, UserClassification] classification
      # @yield [created, user]
      # @yieldparam [Boolean] created
      # @yieldparam [User] user
      # @yieldreturn [void]
      # @return [User]
      def fetch_by_classification(classification)
        enum = UserClassification.fetch classification

        created = false

        where(classification: enum.to_s).first_or_create! do |user|
          enum.populate_values!(user)

          created = true
        end.tap do |user|
          yield created, user if block_given?
        end
      end
    end
  end
end
