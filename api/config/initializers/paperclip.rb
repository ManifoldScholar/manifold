Paperclip.options[:content_type_mappings] = {
  ncx: ["text/html", "application/xml"],
  xhtml: "text/html",
  css: ["text/x-c", "text/css"],
  ttf: ["application/x-font-ttf", "application/x-font-truetype"],
  webm: ["video/webm", "audio/webm"]
}

Paperclip.interpolates :uuid_partition do |attachment, _style|
  id = attachment.instance.id
  id[0..2].scan(/\w/).join("/".freeze)
end

require "paperclip/media_type_spoof_detector"
module Paperclip
  # Monkey patches paper clip to disable spoofed file detection, which breaks on UAT.
  class MediaTypeSpoofDetector
    def spoofed?
      false
    end
  end
end
