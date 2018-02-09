# The User model
class User < ApplicationRecord
  # Constants
  TYPEAHEAD_ATTRIBUTES = [:email, :first_name, :last_name].freeze

  # Concerns
  include Authority::UserAbilities
  include Authority::Abilities
  include Filterable
  include Recoverable
  include Attachments
  include WithParsedName

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Rolify
  rolify
  attr_reader :pending_role

  # Associations
  has_many :identities, inverse_of: :user, autosave: true, dependent: :destroy

  has_many :annotations # TODO: refactor to use "creator_id"
  has_many :favorites # Todo: refactor to use "creator_id"
  has_many :favorite_projects, through: :favorites, source: :favoritable,
                               source_type: "Project"
  has_many :favorite_texts, through: :favorites, source: :favoritable,
                            source_type: "Text"

  has_many :created_texts, class_name: "Text", foreign_key: "creator_id"
  has_many :created_projects, class_name: "Project", foreign_key: "creator_id"
  has_many :created_resources, class_name: "Resource", foreign_key: "creator_id"
  has_many :created_pages, class_name: "Page", foreign_key: "creator_id"
  has_many :created_flags, class_name: "Flag", foreign_key: "creator_id"

  # Validation
  validates :password, length: { minimum: 8 }, allow_nil: true, confirmation: true
  validate :password_not_blank!
  validates :email, presence: true
  validates :email, uniqueness: true, email_format: { message: "is not valid" }
  validates :pending_role, inclusion: { in: Role::ALLOWED_ROLES }, allow_nil: true

  # Callbacks
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
    return all unless email.present?
    where("email ILIKE ?", "#{email}%")
  }
  scope :with_order, lambda { |by|
    return order(:first_name, :last_name) unless by.present?
    order(by)
  }

  def self.cli_user
    User.find_by(is_cli_user: true)
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

  def role=(new_role)
    @pending_role = new_role.to_s
  end

  def role
    admin? ? "admin" : "reader"
  end

  def admin?
    kind == "admin"
  end

  def kind
    return "admin" if has_cached_role? :admin
    return "author" if has_cached_role? :author, :any
    "reader"
  end

  private

  def sync_pending_role!
    return if pending_role.blank?

    roles_to_remove = Role::ALLOWED_ROLES.without(pending_role.to_s)
    roles_to_remove.each { |role| remove_role role }

    add_role pending_role
  end

  def password_not_blank!
    return if password.nil?
    errors.add(:password, "can't be blank") if password.blank?
  end
end
