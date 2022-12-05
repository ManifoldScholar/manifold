# frozen_string_literal: true

module Entitlements
  # @see EntitlementImportRows::CreateEntitlement
  class CreateForRowJob < ApplicationJob
    queue_as :default

    # @param [EntitlementImportRow] row
    # @return [void]
    def perform(row)
      ManifoldApi::Container["entitlement_import_rows.create_entitlement"].(row)
    end
  end
end
