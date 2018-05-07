# A resource is any asset our source document that is associated with a text.
class Resource < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze
  ALLOWED_KINDS = %w(image video audio link pdf document file spreadsheet presentation
                     interactive).freeze
  ALLOWED_SUB_KINDS = %w(external_video).freeze

  # PaperTrail
  has_paper_trail on: [:update],
                  meta: {
                    parent_item_id: :project_id,
                    parent_item_type: "Project"
                  }

  # Tags
  acts_as_ordered_taggable

  # Concerns
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include TrackedCreator
  include Filterable
  include WithMarkdown
  include Attachments
  include ResourceAttachmentValidation
  include ResourceAttributeResets
  include Concerns::HasFormattedAttributes
  include Concerns::HasSortTitle
  include Concerns::Fingerprinted
  include Metadata
  extend FriendlyId

  # Magic
  with_metadata %w(
    series_title container_title isbn issn doi original_publisher
    original_publisher_place original_title publisher publisher_place version
    series_number edition issue volume rights rights_territory restrictions rights_holder
    creator alt_text credit copyright_status
  )
  has_sort_title :title_plaintext

  friendly_id :title, use: :slugged

  # Associations
  belongs_to :project
  has_one :thumbnail_fetch_attempt, dependent: :destroy
  has_one :resource_created_event, -> { where event_type: Event::RESOURCE_ADDED },
          class_name: Event,
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject
  has_one :resource_import_row, inverse_of: :resource, dependent: :nullify
  has_many :collection_resources, dependent: :destroy, inverse_of: :resource
  has_many :collections, through: :collection_resources
  has_many :comments, as: :subject, dependent: :destroy, inverse_of: :subject
  has_many :annotations, dependent: :destroy, inverse_of: :resource

  delegate :slug, to: :project, prefix: true

  manifold_has_attached_file :attachment, :resource
  manifold_has_attached_file :high_res, :image, no_styles: true
  manifold_has_attached_file :variant_thumbnail, :image
  manifold_has_attached_file :variant_poster, :image
  manifold_has_attached_file :variant_format_one, :resource, no_styles: true
  manifold_has_attached_file :variant_format_two, :resource, no_styles: true

  has_formatted_attributes :title, :caption,
                           include_wrap: false
  has_formatted_attribute :description

  # Paperclip direct image from URL
  attr_reader :variant_thumbnail_remote_url

  # Validation
  validates :title, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }, presence: true
  validates :sub_kind,
            inclusion: { in: ALLOWED_SUB_KINDS },
            allow_nil: true,
            allow_blank: true
  validates :fingerprint, uniqueness: true
  validate :validate_kind_fields

  # Scopes
  scope :by_project, lambda { |project|
    return all unless project.present?
    where(project: project)
  }
  scope :by_collection, lambda { |collection|
    return all unless collection.present?
    joins(:collection_resources)
      .where("collection_resources.collection_id = ?", collection)
  }
  scope :by_tag, lambda { |tag|
    return all unless tag.present?
    tagged_with(tag)
  }
  scope :by_kind, lambda { |kind|
    return all unless kind.present?
    where(kind: kind)
  }
  scope :with_collection_order, lambda { |collection_id|
    id = Collection.friendly.find(collection_id)
    joins(:collection_resources)
      .where("collection_resources.collection_id = ?", id)
      .order("collection_resources.position ASC")
  }
  scope :with_order, lambda { |by|
    return order(:created_at, :sort_title) unless by.present?
    order(by)
  }

  # Callbacks
  before_validation :update_kind
  before_update :reset_stale_fields
  after_commit :queue_fetch_thumbnail, on: [:create, :update]
  after_create :resource_to_event
  before_save :set_fingerprint!

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  scope :search_import, lambda {
    includes(:collections, :project)
  }

  def search_data
    {
      title: title_plaintext,
      body: description_plaintext,
      collection_titles: collections.map(&:title),
      project_id: project&.id,
      project_titles: project.title,
      kind: kind,
      sub_kind: sub_kind,
      metadata: metadata,
      caption: caption,
      attachment_file_name: attachment_file_name
    }.merge(search_hidden)
  end

  def search_hidden
    project.present? ? project.search_hidden : { hidden: true }
  end

  # Create a new project event for the new resource
  def resource_to_event
    factory = Factory::Event.new
    event = factory.create(
      Event::RESOURCE_ADDED,
      subject_id: id,
      subject_type: self.class.name
    )
    return if event.valid?
    Rails.logger.info(
      "#resource_to_event created an invalid event: #{event.errors.full_messages}"
    )
  end

  def fetch_thumbnail?
    return unless Thumbnail::Fetcher.accepts?(self)
    !variant_thumbnail.present? || previous_changes.key?(:external_id)
  end

  def queue_fetch_thumbnail(force = false)
    unless force
      return unless fetch_thumbnail?
    end
    FetchResourceThumbnail.perform_later(id)
  end

  def validate_kind_fields
    send("validate_#{kind}_fields")
  end

  def reset_stale_fields
    send("reset_non_#{kind}_attributes")
  end

  def update_kind
    sub_kind.presence
    return self.kind = determine_kind unless kind
    return self.kind = kind.downcase if ALLOWED_KINDS.include?(kind.downcase)
    self.kind = determine_kind # fallback
  end

  def force_update_kind
    self.kind = determine_kind
  end

  # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity
  # rubocop:disable Metrics/CyclomaticComplexity
  def determine_kind
    ext = attachment_extension
    return :image if attachment_is_image?
    return :pdf if ext == "pdf"
    return :document if %w(doc docx txt).include?(ext)
    return :spreadsheet if %w(xls xlsx).include?(ext)
    return :presentation if %w(ppt pptx).include?(ext)
    return :video if %w(mp4 webm).include?(ext)
    return :video if sub_kind == "external_video"
    return :audio if ["mp3"].include?(ext)
    return :link if !attachment.present? && !external_url.blank?
    # We return a default because we always want the resource kind to be valid. If it's
    # not valid, we have a problem because it will prevent Paperclip from processing
    # attachments.
    :file
  end
  # rubocop:enable Metrics/AbcSize, Metrics/PerceivedComplexity
  # rubocop:enable Metrics/CyclomaticComplexity

  # I believe this is here to allow us to pass `Resource` as a scope in our resourceful
  # controllers. See the load_resources_for in the resourceful_methods controller concern.
  # -ZD
  def self.call
    all
  end

  def to_s
    title
  end

  def alt_text
    metadata["alt_text"]
  end

  # rubocop:disable Style/RedundantSelf
  def alt_text=(value)
    self.metadata["alt_text"] = value
  end
  # rubocop:enable Style/RedundantSelf

  def downloadable_kind?
    attachment.exists? && !external_video?
  end

  def downloadable?
    downloadable_kind? && allow_download
  end

  def external_video?
    kind == "video" && sub_kind == "external_video"
  end

  def youtube?
    external_video? && external_type == "youtube"
  end

  def vimeo?
    external_video? && external_type == "vimeo"
  end

  def variant_thumbnail_remote_url=(url_value)
    self.variant_thumbnail = URI.parse(url_value)
    @variant_thumbnail_remote_url = url_value
  end

  private

  def set_fingerprint!
    return if fingerprint.present?
    self.fingerprint = generate_fingerprint fingerprint_candidates
  end

  def fingerprint_candidates
    candidates = %w(external_url).map { |c| __send__ c }
    candidates << %w(external_type external_id).map { |c| __send__ c }.join
    candidates << %w(title attachment).map { |c| __send__ c }.join
    candidates
  end

end
