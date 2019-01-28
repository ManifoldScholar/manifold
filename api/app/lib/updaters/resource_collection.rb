module Updaters
  # Updates a ResourceCollection model from JSON-API style params
  class ResourceCollection
    include ::Updaters

    def attachment_fields
      [
        :thumbnail
      ]
    end

  end
end
