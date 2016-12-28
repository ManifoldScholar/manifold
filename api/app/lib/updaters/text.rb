module Updaters
  # Updates a Texet model from JSON-API style params
  class Text
    include ::Updaters

    def adjusted_attributes
      super
    end

    def post_update(model)
      super(model)
    end

  end
end
