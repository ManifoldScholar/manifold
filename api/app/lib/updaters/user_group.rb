# frozen_string_literal: true

module Updaters
  # Updates a UserGroup model from JSON-API style params
  class UserGroup
    include ::Updaters

    def attachment_fields
      []
    end
  end
end
