module Updaters
  # Updates a Feature model from JSON-API style params
  class Feature
    include ::Updaters

    def attachment_fields
      [:foreground, :background]
    end

    def update(model)
      @model = model
      update_without_save(model)
      save_model(model)
      update_position(model)
      model
    end

  end
end
