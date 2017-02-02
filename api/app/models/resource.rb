# A resource is any asset our source document that is associated with a text.
class Resource < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator
  include Paginated

  # Associations
  belongs_to :project
  has_many :collection_resources, dependent: :destroy
  has_many :collections, through: :collection_resources

  # Attachment Validation
  has_attached_file :attachment,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/resource/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumbnail: ["200x150#"]
                    }
  validation = Rails.application.config.x.api[:attachments][:validations][:resource]
  validates_attachment_content_type :attachment, content_type: validation[:allowed_mime]
  validates_attachment_file_name :attachment, matches: validation[:allowed_ext]

  before_attachment_post_process :resize_images

  # Scopes
  scope :by_project, lambda { |project|
    return all unless project.present?
    where(project: project)
  }

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

  def attachment_is_image?
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

    config = Rails.application.config.x.api
    allowed = config[:attachments][:validations][:image][:allowed_mime]
    allowed.include?(attachment_content_type)
  end

  def attachment_url
    return nil unless attachment.present?
    ENV["API_URL"] + attachment.url
  end

  def resize_images
    res = attachment_is_image?
    res
  end

  def to_s
    title
  end

end
