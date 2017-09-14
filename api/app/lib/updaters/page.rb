module Updaters
  # Updates a Page model from JSON-API style params
  class Page
    include ::Updaters

    def attachment_fields
      []
    end

  end
end
