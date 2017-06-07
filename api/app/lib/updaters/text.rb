module Updaters
  # Updates a Text model from JSON-API style params
  class Text
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
