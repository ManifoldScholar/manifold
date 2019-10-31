module Utility
  # Return a filename that has the correct extension for use with Epub or other
  # established archiving formats.
  class StripExtension < ActiveInteraction::Base
    COMPRESSED_TARBALL = /\A(.+?)\.(tar\.[a-z]{2,})\z/i.freeze
    STANDARD = /\A(.+?)\.([^.\s]+)\z/i.freeze

    string :filename

    validates :filename, presence: true

    # @return [(String, String)] basename and extension
    # @return [(String, nil)] if no extension was found
    def execute
      case filename
      when COMPRESSED_TARBALL
        return Regexp.last_match[1], Regexp.last_match[2]
      when STANDARD
        return Regexp.last_match[1], Regexp.last_match[2]
      else
        return filename, nil
      end
    end
  end
end
