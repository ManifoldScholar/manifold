# frozen_string_literal: true

module Updaters
  # Updates an {::EntitlementImport} model from JSON-API style params
  #
  # @see ::EntitlementImport
  class EntitlementImport
    include ::Updaters

    ATTACHMENTS = %i[file].freeze

    def attachment_fields
      ATTACHMENTS
    end
  end
end
