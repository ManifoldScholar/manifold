module Updaters
  # Updates a TextSection model from JSON-API style params
  class TextSection
    include ::Updaters

    def attachment_fields
      []
    end

    def adjusted_attributes
      return {} unless attributes

      clone = attributes.clone
      clone
    end
  end
end
