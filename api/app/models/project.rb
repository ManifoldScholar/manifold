# The project model is the primary unit of Manifold.
class Project < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title, :makers].freeze

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator
  include Collaborative
  include MoneyAttributes
  include TruthyChecks
  include Paginated
  include Filterable

  # Magic
  merge_hash_attributes! :metadata

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES

  # Associations
  belongs_to :published_text, class_name: "Text", optional: true
  has_many :texts, dependent: :destroy
  has_many :text_categories, -> { for_text }, class_name: "Category", dependent: :destroy
  has_many :resource_categories,
           -> { for_resource },
           class_name: "Category",
           dependent: :destroy
  has_many :favorites, as: :favoritable, dependent: :destroy
  has_many :events, -> { order "events.created_at DESC" }, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :collections, dependent: :destroy
  has_many :collection_resources, through: :collections
  has_many :project_subjects
  has_many :subjects, through: :project_subjects
  # rubocop:disable Style/Lambda
  has_many :uncollected_resources, ->(object) {
    where.not(id: object.collection_resources.select(:resource_id))
  }, class_name: "Resource"
  # rubocop:end Style/Lambda

  # Callbacks
  after_commit :trigger_creation_event, on: [:create]

  # Delegations
  delegate :count, to: :collections, prefix: true
  delegate :count, to: :resources, prefix: true

  # Misc
  money_attributes :purchase_price

  # Validation
  validates :purchase_url, url: { allow_nil: true }
  validates :title, presence: true
  validates :purchase_price_currency,
            inclusion: { in: Money::Currency.all.map(&:iso_code) },
            allow_nil: true

  # Attachments
  has_attached_file :avatar,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumb: ["x246", :png]
                    }
  has_attached_file :cover,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      hero: ["800", :png]
                    }
  has_attached_file :hero,
                    include_updated_timestamp: false,
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    default_url: "",
                    styles: { background: ["1800", :jpg] }
  validation = Rails.application.config.x.api[:attachments][:validations][:image]
  validates_attachment_content_type :cover, content_type: validation[:allowed_mime]
  validates_attachment_content_type :hero, content_type: validation[:allowed_mime]
  validates_attachment_content_type :avatar, content_type: validation[:allowed_mime]
  validates_attachment_file_name :cover, matches: validation[:allowed_ext]
  validates_attachment_file_name :hero, matches: validation[:allowed_ext]
  validates_attachment_file_name :avatar, matches: validation[:allowed_ext]

  # Scopes
  scope :by_featured, lambda { |featured|
    return all if featured.nil?
    where(featured: to_boolean(featured))
  }

  scope :by_subject, lambda { |subject|
    return all unless subject.present?
    joins(:project_subjects).where(project_subjects: { subject: subject })
  }

  # Why is this here? --ZD
  def self.call
    all
  end

  # Used to filter records using DB fields
  def self.query(params)
    Project.all
           .by_featured(params[:featured])
           .by_subject(params[:subject])
           .by_pagination(params[:page], params[:per_page])
  end

  # Used to filter records using elastic search index
  def self.search(params)
    query = params.dig(:keyword) || "*"
    filter = Search::FilterScope.new
                                .typeahead(params[:typeahead], TYPEAHEAD_ATTRIBUTES)
                                .paginate(params[:page], params[:per_page])
    Project.lookup(query, filter)
  end

  def search_data
    {
      title: title,
      description: description,
      makers: makers.map(&:name)
    }
  end

  def resource_kinds
    resources
      .select("resources.kind")
      .distinct
      .to_a.pluck(:kind)
  end

  def twitter_following
    return [] unless tweet_fetch_config && tweet_fetch_config["following"].is_a?(Array)
    tweet_fetch_config["following"].map do |h|
      ActiveSupport::HashWithIndifferentAccess.new(h)
    end
  end

  def following_twitter_accounts?
    twitter_following.length.positive?
  end

  def avatar_url
    return nil if avatar.url(:thumb).blank?
    ENV["API_URL"] + avatar.url(:thumb)
  end

  def cover_url
    return nil if cover.url(:hero).blank?
    ENV["API_URL"] + cover.url(:hero)
  end

  def hero_url
    return nil if hero.url(:background).blank?
    ENV["API_URL"] + hero.url(:background)
  end

  def to_s
    title
  end

  private

  def trigger_creation_event
    Event.trigger(Event::PROJECT_CREATED, self)
  end
end
