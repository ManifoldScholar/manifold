module Utility
  class FetchExtensionForContentType < ActiveInteraction::Base
    OVERRIDES = {
      "application/vnd.ms-opentype" => "otf",
      "application/xhtml+xml" => "xhtml",
      "image/jpeg" => "jpg"
    }.freeze

    string :content_type

    validates :content_type, presence: true

    # @return [String, nil]
    def execute
      OVERRIDES.fetch content_type do
        matching_types = MIME::Types[content_type]

        type = matching_types.first

        type&.preferred_extension
      end
    end
  end
end
