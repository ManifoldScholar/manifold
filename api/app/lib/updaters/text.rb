module Updaters
  # Updates a Text model from JSON-API style params
  class Text
    include ::Updaters
    include ::Updaters::Concerns::HasSortableCollaborators
  end
end
