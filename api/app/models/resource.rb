# A resource is any asset our source document that is associated with a text.
class Resource < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze
  ALLOWED_KINDS = %w(image video audio link pdf document file spreadsheet presentation
                     interactive).freeze
  ALLOWED_SUB_KINDS = %w(external_video).freeze
  IFRAME_ALLOWS_ATTRIBUTES = %w(camera fullscreen).freeze

  # PaperTrail
  has_paper_trail meta: {
    parent_item_id: :project_id,
    parent_item_type: "Project"
  }
  # Concerns
  include Authority::Abilities
  include Collectable
  include SerializedAbilitiesFor
  include TrackedCreator
  include Filterable
  include Attachments
  include ResourceAttachmentValidation
  include ResourceAttributeResets
  include HasFormattedAttributes
  include HasSortTitle
  include Fingerprinted
  include Taggable
  include Sluggable
  include Metadata
  include SearchIndexable

  # Magic
  with_metadata %w(
    series_title container_title isbn issn doi original_publisher
    original_publisher_place original_title publisher publisher_place version
    series_number edition issue volume rights rights_territory restrictions rights_holder
    creator alt_text credit copyright_status
  )
  has_sort_title :sort_title_candidate

  # Associations
  belongs_to :project, counter_cache: true
  has_one :thumbnail_fetch_attempt, dependent: :destroy
  has_one :resource_created_event, -> { where event_type: EventType[:resource_added] },
          class_name: "Event",
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject
  has_one :resource_import_row, inverse_of: :resource, dependent: :nullify
  has_many :collection_resources, dependent: :destroy, inverse_of: :resource
  has_many :resource_collections, through: :collection_resources
  has_many :comments, as: :subject, dependent: :destroy, inverse_of: :subject
  has_many :annotations, dependent: :destroy, inverse_of: :resource

  delegate :slug, to: :project, prefix: true

  manifold_has_attached_file :attachment, :resource
  manifold_has_attached_file :high_res, :image, no_styles: true
  manifold_has_attached_file :variant_thumbnail, :image
  manifold_has_attached_file :variant_poster, :image
  manifold_has_attached_file :variant_format_one, :resource, no_styles: true
  manifold_has_attached_file :variant_format_two, :resource, no_styles: true
  manifold_has_attached_file :translation, :resource, no_styles: true
  manifold_has_attached_file :transcript, :resource, no_styles: true

  has_formatted_attributes :title, :caption,
                           include_wrap: false
  has_formatted_attribute :description

  # Validation
  validates :title, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }, presence: true
  validates :sub_kind,
            inclusion: { in: ALLOWED_SUB_KINDS },
            allow_nil: true,
            allow_blank: true
  validates :fingerprint,
            uniqueness: { scope: :project,
                          message: "has already been taken. " \
                                   "Verify resource content is unique to project" }
  validate :validate_kind_fields
  validate :validate_interactive_dimensions
  validate :validate_iframe_allows

  # Scopes
  scope :by_project, lambda { |project|
    return all unless project.present?

    where(project: project)
  }
  scope :by_resource_collection, lambda { |collection|
    return all unless collection.present?

    joins(:collection_resources)
      .where("collection_resources.resource_collection_id = ?", collection)
  }
  scope :by_kind, lambda { |kind|
    return all unless kind.present?

    where(kind: kind)
  }
  scope :with_collection_order, lambda { |collection_id|
    id = ResourceCollection.friendly.find(collection_id)
    joins(:collection_resources)
      .where("collection_resources.resource_collection_id = ?", id)
      .order("collection_resources.position ASC")
  }
  scope :with_order, lambda { |by = nil|
    return order(:sort_title, :created_at) unless by.present?

    order(by)
  }

  # Callbacks
  before_validation :update_kind, :set_fingerprint!
  before_validation :parse_and_set_external_id!, if: :external_video?
  before_update :reset_stale_fields
  after_commit :queue_fetch_thumbnail, on: [:create, :update]
  after_commit :trigger_event_creation, on: [:create]

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  scope :search_import, lambda {
    includes(:resource_collections, :project)
  }

  # rubocop:disable Metrics/AbcSize
  def search_data
    {
      search_result_type: search_result_type,
      title: title_plaintext,
      full_text: [description_plaintext, caption].reject(&:blank?).join("\n"),
      parent_project: project&.id,
      parent_keywords: resource_collections.map(&:title) + [project&.title],
      metadata: metadata.values.reject(&:blank?),
      keywords: (tag_list + attachment_file_name).reject(&:blank?)
    }.merge(search_hidden)
  end
  # rubocop:enable Metrics/AbcSize

  def search_hidden
    project.present? ? project.search_hidden : { hidden: true }
  end

  def fetch_thumbnail?
    return unless Thumbnail::Fetcher.accepts?(self)

    !variant_thumbnail.present? || previous_changes.key?(:external_id)
  end

  def queue_fetch_thumbnail(force: false)
    return unless force || fetch_thumbnail?

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

  def sort_title_candidate
    candidate = pending_sort_title.blank? ? title_plaintext : pending_sort_title
    candidate.delete "\"", "'"
  end

  # rubocop:disable Metrics/PerceivedComplexity
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
  # rubocop:enable Metrics/PerceivedComplexity
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
    attachment? && !external_video?
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

  def external_video_service_url
    if youtube?
      URI::HTTPS.build(host: "www.youtube.com", path: "/watch", query: { v: external_id }.to_query).to_s
    elsif vimeo?
      URI.join("https://vimeo.com/", external_id).to_s
    end
  end

  def external_video_packaging_metadata
    return {} unless external_video?

    slice(:sub_kind, :external_id, :external_type, :external_video_service_url)
  end

  # @return [{ Symbol => Object }]
  def packaging_metadata
    simplified = {
      title: title_plaintext,
      description: description_plaintext,
      caption: caption_plaintext,
      tags: tag_list,
    }.compact

    metadata.with_indifferent_access
      .merge(slice(:id, :slug, :kind, :external_url, :created_at, :updated_at))
      .merge(**simplified)
      .merge(external_video_packaging_metadata)
  end

  private

  def parse_and_set_external_id!
    outcome = Resources::ExtractExternalVideoId.run(
      external_id: external_id,
      external_type: external_type
    )

    if outcome.valid?
      self.external_id = outcome.result
    else
      merge_errors! outcome.errors
    end
  end

  def trigger_event_creation
    Event.trigger(EventType[:resource_added], self)
  end

  def set_fingerprint!
    return if fingerprint.present?

    self.fingerprint = generate_fingerprint fingerprint_candidates
  end

  def fingerprint_candidates
    candidates = %w(external_url).map { |c| __send__ c }
    candidates << %w(external_type external_id).map { |c| __send__ c }.join
    candidates << %w(title attachment_file_name).map { |c| __send__ c }.join
    candidates
  end

  def allowed_units?(value)
    return true if value.blank?

    value.match(/^\d+(px|rem|vh|vw)*$/)
  end

  def validate_interactive_dimensions
    errors.add(:minimum_width, "must be an integer or use allowed units") unless allowed_units?(minimum_width)

    errors.add(:minimum_height, "must be an integer or use allowed units") unless allowed_units?(minimum_height)
  end

  def validate_iframe_allows
    iframe_allows.each do |attr|
      errors.add(:iframe_allows, "#{attr} is not an allowed iframe attribute") unless IFRAME_ALLOWS_ATTRIBUTES.include?(attr)
    end
  end
end
