# A resource is any asset our source document that is associated with a text.
class Resource < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze
  ALLOWED_KINDS = %w(image video audio link pdf document file spreadsheet presentation
                     interactive).freeze

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Tags
  acts_as_ordered_taggable

  # Concerns
  include Authority::Abilities
  include TrackedCreator
  include Filterable
  include WithMarkdown
  include Attachments
  include ResourceAttachmentValidation
  include ResourceAttributeResets

  # Associations
  belongs_to :project
  has_many :collection_resources, dependent: :destroy
  has_many :collections, through: :collection_resources

  manifold_has_attached_file :attachment, :resource
  manifold_has_attached_file :high_res, :image, no_styles: true
  manifold_has_attached_file :variant_thumbnail, :image
  manifold_has_attached_file :variant_poster, :image
  manifold_has_attached_file :variant_format_one, :resource, no_styles: true
  manifold_has_attached_file :variant_format_two, :resource, no_styles: true

  # Validation
  validates :title, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }, presence: true
  validate :validate_kind_fields

  # Scopes
  scope :by_project, lambda { |project|
    return all unless project.present?
    where(project: project)
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
    joins(:collection_resources)
      .where("collection_resources.collection_id = ?", collection_id)
      .order("collection_resources.position ASC")
  }
  scope :with_order, lambda { |by|
    return order(:created_at, :title) unless by.present?
    order(by)
  }

  # Callbacks
  before_validation :update_kind
  before_update :reset_stale_fields
  before_save :update_tags
  before_save :update_title_formatted
  before_save :update_caption_formatted
  before_save :update_description_formatted

  def validate_kind_fields
    send("validate_#{kind}_fields")
  end

  def reset_stale_fields
    send("reset_non_#{kind}_attributes")
  end

  def update_kind
    return self.kind = determine_kind unless kind
    return self.kind = kind.downcase if ALLOWED_KINDS.include?(kind.downcase)
    self.kind = determine_kind # fallback
  end

  def force_update_kind
    self.kind = determine_kind
  end

  def update_title_formatted
    self.title_formatted = render_simple_markdown(title)
  end

  def update_caption_formatted
    self.caption_formatted = render_simple_markdown(caption)
  end

  def update_description_formatted
    self.description_formatted = render_simple_markdown(description)
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
    return :video if %w(youtube vimeo).include?(external_type)
    return :audio if ["mp3"].include?(ext)
    return :interactive if is_iframe || embed_code.present?
    return :link if !attachment.present? && !external_url.blank?
    # We return a default because we always want the resource kind to be valid. If it's
    # not valid, we have a problem because it will prevent Paperclip from processing
    # attachments.
    :file
  end
  # rubocop:enable Metrics/AbcSize, Metrics/PerceivedComplexity
  # rubocop:enable Metrics/CyclomaticComplexity

  def update_tags
    return unless keywords
    self.tag_list = keywords
  end

  # Why is this here? --ZD
  def self.call
    all
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

  def to_s
    title
  end

  def downloadable_kind?
    attachment.exists? && !is_external_video
  end

  def downloadable?
    downloadable_kind? && allow_download
  end

  def external_video?
    is_external_video || false
  end

  def iframe?
    is_iframe || false
  end

  def split_iframe_dimensions
    return nil unless iframe_dimensions
    iframe_dimensions.split("x")
  end

end
