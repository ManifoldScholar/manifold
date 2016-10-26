# Connects texts to resources that were sources for text sections during ingestion
class IngestionSource < ActiveRecord::Base
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  KIND_PUBLICATION_RESOURCE = "publication_resource".freeze
  ALLOWED_KINDS = [
    KIND_COVER_IMAGE,
    KIND_NAVIGATION,
    KIND_SECTION,
    KIND_PUBLICATION_RESOURCE
  ].freeze

  belongs_to :text
  delegate :project, to: :text

  has_attached_file :attachment, include_updated_timestamp: false
  validates_attachment_content_type :attachment, content_type: %w(
    image/gif
    image/jpeg
    image/png
    image/svg+xml
    application/xhtml+xml
    application/x-dtbncx+xml
    application/vnd.ms-opentype
    application/font-woff
    application/smil+xml
    application/pls+xml
    application/xml
    audio/mpeg
    audio/mp4
    text/css
    text/x-c
    text/javascript
    text/html
    text/plain
    application/x-font-ttf
    application/x-font-truetype
    application/x-font-otf
    video/mp4
    video/webm
  )

  validates_attachment_file_name :attachment, matches: [
    /gif\Z/,
    /jpe?g\Z/,
    /png\Z/,
    /svg\Z/,
    /x?html\Z/,
    /ttf\Z/,
    /otf\Z/,
    /woff\Z/,
    /mp3\Z/,
    /pls\Z/,
    /smil\Z/,
    /xml\Z/,
    /mp3\Z/,
    /mp4\Z/,
    /css\Z/,
    /ncx\Z/,
    /js\Z/,
    /webm\Z/
  ]

  validates :source_identifier, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }
end
