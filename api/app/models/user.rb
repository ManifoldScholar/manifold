# The User model
class User < ApplicationRecord
  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title, :first_name, :last_name, :email].freeze

  # Concerns
  include Authority::Abilities
  include Authority::UserAbilities
  include Concerns::SerializedAbilitiesOn
  include Concerns::SerializedAbilitiesFor
  include Concerns::NotificationPreferences
  include Concerns::ProvidesEntitlements
  include Concerns::ReceivesEntitlements
  include Filterable
  include Recoverable
  include Attachments
  include WithParsedName

  classy_enum_attr :role, enum: "RoleName", allow_blank: false, default: :reader
  classy_enum_attr :kind, enum: "RoleName", allow_blank: false, default: :reader

  # Rolify
  rolify after_add: :synchronize_kind!, after_remove: :synchronize_kind!

  # Associations
  has_many :identities, inverse_of: :user, autosave: true, dependent: :destroy
  has_many :annotations, foreign_key: "creator_id", dependent: :destroy,
           inverse_of: :creator
  has_many :favorites, dependent: :destroy
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
  has_many :reading_groups, through: :reading_group_memberships
  has_many :entitlement_user_links, inverse_of: :user, dependent: :destroy
  has_many :granted_entitlements, through: :entitlement_user_links, source: :entitlement

  # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :permissions

  has_one :derived_role, inverse_of: :user, class_name: "UserDerivedRole"
  # rubocop:enable Rails/HasManyOrHasOneDependent

  # Validation
  validates :password, length: { minimum: 8 }, allow_nil: true, confirmation: true
  validate :password_not_blank!
  validates :email, presence: true, case_sensitive: false
  validates :email, uniqueness: true, email_format: { message: "is not valid" }
  validates :first_name, :last_name, presence: true

  before_validation :infer_kind!
  before_validation :infer_role!

  after_save :sync_global_role!, if: :saved_change_to_role?

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
  scope :with_order, lambda { |by|
    return order(:last_name, :first_name) unless by.present?

    order(by)
  }
  scope :by_role, ->(role) { RoleName[role].then { |r| with_role(r.to_sym) if r.present? } }
  scope :by_cached_role, ->(*role) { where(role: role) }

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  delegate *RoleName.global_predicates, to: :role
  delegate *RoleName.scoped_predicates, to: :kind

  def search_data
    {
      title: full_name,
      first_name: first_name,
      last_name: last_name,
      email: email,
      keywords: [role],
      hidden: true
    }
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

  def favorite(favoritable)
    favorites.create(favoritable: favoritable)
  end

  def favorite?(favoritable)
    favorites.where(favoritable_id: favoritable.id).count.positive?
  end

  def to_s
    name
  end

  def force_reset_password
    self.password = SecureRandom.hex(6)
  end

  def send_welcome_email
    AccountMailer.welcome(self, false).deliver
  end

  def created?(resource)
    return false unless resource.respond_to? :creator

    resource.creator == self
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

  # @param [Role]
  # @return [void]
  def synchronize_kind!(role)
    sync_notification_preferences! role

    return if @synchronizing_global_role

    updates = {}

    updates[:role] = RoleName.fetch_for(self) if role.global?
    updates[:kind] = RoleName.fetch_for_kind(self) if role.global? || role.scoped?

    update_columns updates if updates.any?
  end

  def password_not_blank!
    return if password.nil?

    errors.add(:password, "can't be blank") if password.blank?
  end

  # rubocop:disable Metrics/BlockLength, Style/MultilineBlockChain
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
  # rubocop:enable Metrics/BlockLength, Style/MultilineBlockChain
end
