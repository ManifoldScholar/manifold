module Updaters
  # Updates an Ingestion model from JSON-API style params
  class Ingestion
    include ::Updaters

    def attachment_fields
      [:source]
    end

    # We use Shrine for supporting tus instead of paperclip
    def attachment_from_params!(attributes, key, _model = nil)
      attributes.extract!(key)[key].presence
    end
  end
end
