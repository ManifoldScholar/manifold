# A resource is any asset our source document that is associated with a text.
class Resource < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Tags
  acts_as_ordered_taggable

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator
  include Paginated

  # Associations
  belongs_to :project
  has_many :collection_resources, dependent: :destroy
  has_many :collections, through: :collection_resources

  # Constants
  ATTACHMENT_STYLES = {
    small: ["320x320"],
    small_square: "",
    small_landscape: "",
    small_portrait: "",
    medium: ["480x480"],
    medium_square: "",
    medium_landscape: "",
    medium_portrait: ""
  }.freeze
  CONVERT_OPTIONS = {
    small_square: "-gravity north -thumbnail 320x320^ -extent 320x320",
    small_landscape: "-gravity north -thumbnail 320x200^ -extent 320x200",
    small_portrait: "-gravity north -thumbnail 320x246^ -extent 320x246",
    medium_square: "-gravity north -thumbnail 480x480^ -extent 480x480",
    medium_landscape: "-gravity north -thumbnail 480x300^ -extent 480x300",
    medium_portrait: "-gravity north -thumbnail 480x369^ -extent 480x369"
  }.freeze

  # Attachment Validation
  has_attached_file :attachment,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/resource/:uuid_partition/:id/:style_:filename",
                    styles: ATTACHMENT_STYLES,
                    convert_options: CONVERT_OPTIONS
  validation = Rails.configuration.manifold.attachments.validations.resource
  validates_attachment_content_type :attachment, content_type: validation[:allowed_mime]
  validates_attachment_file_name :attachment, matches: validation[:allowed_ext]

  before_attachment_post_process :resize_images

  # Validation
  validates :title, presence: true

  # Scopes
  scope :by_project, lambda { |project|
    return all unless project.present?
    where(project: project)
  }

  # Callbacks
  before_save :update_tags

  def update_tags
    return unless keywords
    self.tag_list = keywords
  end

  # Why is this here? --ZD
  def self.call
    all
  end

  def self.filter(params)
    results = params.key?(:keyword) ? search(params) : query(params)
    if exceeds_total_pages?(results)
      params[:page] = results.total_pages
      return filter(params)
    end
    results
  end

  # Used to filter records using DB fields
  def self.query(params)
    Resource.all
            .order(:created_at, :title)
            .by_project(params[:project])
            .by_pagination(params[:page], params[:per_page])
  end

  # Used to filter records using elastic search index
  def self.search(params)
    query = params.dig(:keyword) || "*"
    filter = Search::FilterScope.new
                                .typeahead(params[:typeahead], TYPEAHEAD_ATTRIBUTES)
                                .paginate(params[:page], params[:per_page])
    Resource.lookup(query, filter)
  end

  def search_data
    {
      title: title,
      project_id: project_id,
      kind: kind,
      caption: caption,
      attachment_file_name: attachment_file_name
    }
  end

  def patterns
    allowed = Rails.configuration.manifold.attachments.validations.image.allowed_mime
    patterns = Regexp.union(allowed)
    patterns
  end

  def attachment_is_image?
    return false unless attachment.present?
    !attachment_content_type.match(allowed_mimes_for(:image)).nil?
  end

  def allowed_mimes_for(type)
    config = Rails.configuration.manifold.attachments.validations
    Regexp.union(config[type][:allowed_mime])
  end

  def attachment_url
    return nil unless attachment.present?
    Rails.configuration.manifold.api_url + attachment.url
  end

  def attachment_thumbnails
    is_image = attachment_is_image?
    styles = ATTACHMENT_STYLES.keys.map do |style|
      value = nil
      if is_image
        value = "#{Rails.configuration.manifold.api_url}#{attachment.url(style)}"
      end
      [style, value]
    end
    Hash[styles]
  end

  def resize_images
    res = attachment_is_image?
    res
  end

  def to_s
    title
  end

end
