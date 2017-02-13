# The User model
class User < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:email, :first_name, :last_name].freeze

  # Concerns
  include Paginated
  include Filterable

  # Authority
  include Authority::UserAbilities
  include Authority::Abilities

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Associations
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
  has_many :user_claims
  has_many :makers, through: :user_claims

  # Validation
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :password, confirmation: true,
                       unless: proc { |user| user.password.blank? }
  validates :nickname, :first_name, :last_name, :email, presence: true
  validates :email, uniqueness: true

  # Attachments
  has_attached_file :avatar,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: { medium: "300x300>", thumb: "100x100>" }
  validation = Rails.configuration.manifold.attachments.validations.image
  validates_attachment_content_type :avatar,
                                    content_type: validation[:allowed_mime],
                                    unless: proc { |record| record[:image].nil? }
  validates_attachment_file_name :avatar, matches: validation[:allowed_ext]

  # Callbacks
  before_validation :ensure_nickname

  # Misc
  has_secure_password

  # Scopes
  scope :by_email, lambda { |email|
    return all unless email.present?
    where("email ILIKE ?", "#{email}%")
  }

  # Methods
  def self.query(params)
    User.all
        .order(:first_name, :last_name)
        .by_email(params[:email])
        .by_pagination(params[:page], params[:per_page])
  end

  def self.search(params)
    query = params.dig(:keyword) || "*"
    filter = Search::FilterScope.new
                                .typeahead(params[:typeahead], TYPEAHEAD_ATTRIBUTES)
                                .paginate(params[:page], params[:per_page])
    User.lookup(query, filter)
  end

  def ensure_nickname
    self.nickname = first_name if nickname.blank?
  end

  # Transform a name into first and last names
  def name=(name)
    name_parts = name.split
    first = name_parts[0]
    last = name_parts[-1]
    self.first_name = first
    self.last_name = last
  end

  def name
    "#{first_name} #{last_name}"
  end

  def avatar_url
    return nil unless avatar.present?
    Rails.configuration.manifold.api_url + avatar.url
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

end
