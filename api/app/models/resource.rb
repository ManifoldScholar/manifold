# A resource is any asset our source document that is associated with a text.
class Resource < ActiveRecord::Base
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
  validates :attachment, attachment_presence: true
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
end
