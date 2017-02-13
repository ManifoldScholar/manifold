# A person or organization involved with the creation of a text
class Maker < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:first_name, :last_name].freeze

  # Authority
  include Authority::Abilities

  # Concerns
  include Paginated
  include Filterable

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Associations
  has_many :collaborators
  has_many :user_claims
  has_many :users, through: :user_claims

  # Attachments
  has_attached_file :avatar,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumb: ["x246", :png],
                      square: ["246x246#"]
                    }
  validation = Rails.configuration.manifold.attachments.validations.image
  validates_attachment_content_type :avatar, content_type: validation[:allowed_mime]
  validates_attachment_file_name :avatar, matches: validation[:allowed_ext]

  validates :first_name, presence: true
  validates :last_name, presence: true

  # Used to filter records using DB fields
  def self.query(params)
    Maker.all
         .by_pagination(params[:page], params[:per_page])
  end

  # Used to filter records using elastic search index
  def self.search(params)
    query = params.dig(:keyword) || "*"
    filter = Search::FilterScope.new
                                .typeahead(params[:typeahead], TYPEAHEAD_ATTRIBUTES)
                                .paginate(params[:page], params[:per_page])
    Maker.lookup(query, filter)
  end

  def self.parse_name(name)
    parts = {}
    parts[:first_name] = if name.split.count > 1
                           name.split[0..-2].join(" ")
                         else
                           name
                         end
    parts[:last_name] = name.split.last if name.split.count > 1
    parts
  end

  def name=(name)
    parts = Maker.parse_name(name)
    self.first_name = parts[:first_name]
    self.last_name = parts[:last_name]
  end

  def name
    "#{first_name} #{last_name}"
  end

  def avatar_url
    return nil if avatar.url(:square).blank?
    Rails.configuration.manifold.api_url + avatar.url(:square)
  end

  def full_name
    [first_name, middle_name, last_name].reject(&:blank?).join(" ")
  end

  def to_s
    full_name
  end

end
