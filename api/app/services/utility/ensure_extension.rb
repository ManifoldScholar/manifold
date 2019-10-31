module Utility
  # Return a filename that has the correct extension for use with Epub or other
  # established archiving formats.
  class EnsureExtension < ActiveInteraction::Base
    string :filename
    string :content_type, default: nil

    validates :filename, presence: true

    # @return [String]
    def execute
      expected_extension = compose Utility::FetchExtensionForContentType, inputs if content_type.present?

      return filename unless expected_extension.present?

      basename, _extension = compose Utility::StripExtension, inputs

      "#{basename}.#{expected_extension}"
    end
  end
end
