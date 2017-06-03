module Updaters
  # Updates a Collection model from JSON-API style params
  class Collection
    include ::Updaters

    def attachment_fields
      [
        :thumbnail
      ]
    end

  end
end
