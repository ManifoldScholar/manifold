# frozen_string_literal: true

module Entitlements
  class ProcessImportJob < ApplicationJob
    queue_as :default

    # @param [EntitlementImport] import
    # @return [void]
    def perform(import)
      ManifoldApi::Container["entitlement_imports.process"].(import)
    end
  end
end
