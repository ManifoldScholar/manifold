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
  include Filterable
  include Recoverable
  include Attachments
  include WithParsedName

  # Rolify
  rolify after_add: :sync_notification_preferences!,
         after_remove: :sync_notification_preferences!
  attr_reader :pending_role

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
  # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :permissions
  # rubocop:enable Rails/HasManyOrHasOneDependent

  # Validation
  validates :password, length: { minimum: 8 }, allow_nil: true, confirmation: true
  validate :password_not_blank!
  validates :email, presence: true, case_sensitive: false
  validates :email, uniqueness: true, email_format: { message: "is not valid" }
  validates :pending_role, inclusion: { in: Role::ALLOWED_ROLES }, allow_nil: true
  validates :first_name, :last_name, presence: true

  # Callbacks
  before_create :assign_default_role!
  after_save :sync_pending_role!

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
  scope :by_email, lambda { |email|
    where("email ILIKE ?", "#{email}%") if email.present?
  }
  scope :with_order, lambda { |by|
    return order(:last_name, :first_name) unless by.present?

    order(by)
  }
  scope :by_role, lambda { |role|
    with_role role.to_sym if role.present?
  }

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

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

  # Creates user.role_name? methods for all roles
  Role::GLOBAL_ROLES.each do |role_name|
    define_method "#{role_name}?" do
      role == role_name
    end
  end

  Role::SCOPED_ROLES.each do |role_name|
    define_method "#{role_name}?" do
      kind == role_name
    end

    define_method "#{role_name}_of?" do |resource|
      has_role? role_name, resource
    end
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

  def role=(new_role)
    @pending_role = new_role.to_s
  end

  # Global roles
  def role
    Role::GLOBAL_ROLES.each do |role_name|
      return role_name if has_cached_role? role_name
    end
    Role::ROLE_READER
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/LineLength, Metrics/PerceivedComplexity
  def kind
    return Role::ROLE_ADMIN if has_cached_role? Role::ROLE_ADMIN
    return Role::ROLE_EDITOR if has_cached_role? Role::ROLE_EDITOR
    return Role::ROLE_PROJECT_CREATOR if has_cached_role? Role::ROLE_PROJECT_CREATOR
    return Role::ROLE_MARKETEER if has_cached_role? Role::ROLE_MARKETEER
    return Role::ROLE_PROJECT_EDITOR if has_cached_role? Role::ROLE_PROJECT_EDITOR, :any
    return Role::ROLE_PROJECT_RESOURCE_EDITOR if has_cached_role? Role::ROLE_PROJECT_RESOURCE_EDITOR, :any
    return Role::ROLE_PROJECT_AUTHOR if has_cached_role? Role::ROLE_PROJECT_AUTHOR, :any

    Role::ROLE_READER
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/LineLength, Metrics/PerceivedComplexity

  private

  def assign_default_role!
    return unless pending_role.blank?

    add_role Role::ROLE_READER
  end

  def sync_pending_role!
    return if pending_role.blank?

    roles_to_remove = Role::GLOBAL_ROLES.without(pending_role.to_s)
    roles_to_remove.each { |role| remove_role role }

    add_role pending_role
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
