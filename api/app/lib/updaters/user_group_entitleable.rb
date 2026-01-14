# frozen_string_literal: true

module Updaters
  # Updates a UserGroupEntitleable model from JSON-API style params
  class UserGroupEntitleable
    include ::Updaters

    def attachment_fields
      []
    end
  end
end
