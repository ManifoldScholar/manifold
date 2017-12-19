# The User model
class User < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:email, :first_name, :last_name].freeze
  ROLE_ADMIN = "admin".freeze
  ROLE_AUTHOR = "author".freeze
  ROLE_CLI = "cli".freeze
  ROLE_READER = "reader".freeze
  ROLE_KEYS = [
    ROLE_ADMIN,
    ROLE_AUTHOR,
    ROLE_CLI,
    ROLE_READER
  ].freeze

  # Concerns
  include Authority::UserAbilities
  include Authority::Abilities
  include Filterable
  include Recoverable
  include Attachments
  include Attachments

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

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
  has_many :user_claims
  has_many :makers, through: :user_claims

  # Validation
  validates :password, length: { minimum: 8 }, allow_nil: true, confirmation: true
  validate :password_not_blank!
  validates :nickname, :first_name, :last_name, :email, presence: true
  validates :email, uniqueness: true
  validates :role, inclusion: { in: ROLE_KEYS }, presence: true

  # Attachments
  manifold_has_attached_file :avatar, :image

  # Callbacks
  before_validation :ensure_nickname

  # Misc
  composed_of :persistent_ui,
              class_name: "PersistentUI",
              mapping: [%i(raw_persistent_ui preferences)],
              converter: ->(raw_persistent_ui) { PersistentUI.new(raw_persistent_ui) }
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

  def ensure_nickname
    self.nickname = first_name if nickname.blank?
  end

  # Transform a name into first and last names
  def name=(name)
    parts = name.try(:split) || []
    first = parts.length > 1 ? parts.take(parts.size - 1).join(" ") : parts.first
    last = parts.length > 1 ? parts.last : nil
    self.first_name = first
    self.last_name = last
  end

  def name
    "#{first_name} #{last_name}"
  end

  def favorite(favoritable)
    favorites.create(favoritable: favoritable)
  end

  def favorite?(favoritable)
    favorites.where(favoritable_id: favoritable.id).count.positive?
  end

  def admin?
    role == "admin"
  end

  def to_s
    name
  end

  def full_name
    [first_name, last_name].reject(&:blank?).join(" ")
  end

  def force_reset_password
    self.password = SecureRandom.hex(6)
  end

  def send_welcome_email
    AccountMailer.welcome(self, false).deliver
  end

  private

  def password_not_blank!
    return if password.nil?
    errors.add(:password, "can't be blank") if password.blank?
  end
end
