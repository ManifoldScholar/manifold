module Updaters
  # Updates a Resource Import model from JSON-API style params
  class ResourceImport
    include ::Updaters

    set_callback :save, :after, :update_state

    def update_state
      state = attributes[:state]
      return if state.blank?
      return if @model.new_record?

      @model.state_machine.transition_to(state.to_sym)
    end

    def attachment_fields
      [:data]
    end

    def adjusted_attributes
      return {} unless attributes

      clone = attributes.clone
      remove_state!(clone)
      clone
    end

    def remove_state!(attributes)
      attributes.delete(:state)
    end

  end
end
