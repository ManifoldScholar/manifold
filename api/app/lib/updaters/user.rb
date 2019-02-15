module Updaters
  # Updates a User model from JSON-API style params
  class User
    include ::Updaters

    set_callback(:save, :after, :unsubscribe!)

    def attachment_fields
      [:avatar]
    end

    def adjusted_attributes
      return {} unless attributes

      clone = attributes.clone
      clone.delete(:unsubscribe)
      clone
    end

    private

    def unsubscribe!
      return unless attributes[:unsubscribe].present?

      @model.unsubscribe_all
    end

  end
end
