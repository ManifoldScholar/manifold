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
      clone[:body_json] = convert_body_to_json
      clone
    end

    private

    def convert_body_to_json
      return unless attributes[:body].present?

      Serializer::HTML.serialize_as_json(attributes[:body])
    end

  end
end
