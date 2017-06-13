module Updaters
  # Updates an Stylesheet model from JSON-API style params
  class Stylesheet
    include ::Updaters

    def update(model)
      @model = model
      update_without_save(model)
      save_model(model)
      update_position(model)
      model
    end

  end
end
