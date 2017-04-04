module Updaters
  # Updates an Ingestion model from JSON-API style params
  class Ingestion
    include ::Updaters

    def attachment_fields
      [:source]
    end

    # def adjusted_attributes
    #   return {} unless attributes
    #   clone = attributes.to_h
    #   update_source!(clone)
    #   clone
    # end

  end
end
