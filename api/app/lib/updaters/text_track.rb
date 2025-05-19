module Updaters
  # Updates a TextTrack model from JSON-API style params
  class TextTrack
    include ::Updaters

    def attachment_fields
      [:cues]
    end
  end
end
