Paperclip.options[:content_type_mappings] = {
  ncx: ["text/html", "application/xml"],
  xhtml: "text/html",
  css: ["text/x-c", "text/css"],
  ttf: ["application/x-font-ttf", "application/x-font-truetype"],
  webm: ["video/webm", "audio/webm"]
}

require 'paperclip/media_type_spoof_detector'
module Paperclip
  class MediaTypeSpoofDetector
    def spoofed?
      false
    end
  end
end
