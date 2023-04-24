# frozen_string_literal: true

module API
  module V1
    class EntitlementImportsController < ApplicationController
      INCLUSIONS = [
        :transitions,
        {
          entitlement_import_rows: [
            :subject, :target, :entitlement, :transitions
          ]
        }
      ].freeze

      INCLUDES = %i[entitlement_import_rows entitlement_import_rows.subject entitlement_import_rows.target].freeze

      resourceful! EntitlementImport, authorize_options: { except: [:index] } do
        EntitlementImport.preload(*INCLUSIONS).filtered(with_pagination!({}), scope: EntitlementImport.with_order)
      end

      def index
        authorize_action_for EntitlementImport, unscoped: true

        @entitlement_imports = load_entitlement_imports

        render_multiple_resources @entitlement_imports, include: INCLUDES
      end

      def show
        @entitlement_import = load_and_authorize_entitlement_import

        render_single_resource @entitlement_import
      end

      def create
        @entitlement_import = EntitlementImport.new creator: current_user

        authorize_action_for @entitlement_import

        @entitlement_import = ::Updaters::EntitlementImport.new(entitlement_import_params).update(@entitlement_import)

        Entitlements::ProcessImportJob.perform_later @entitlement_import if @entitlement_import.id

        render_single_resource @entitlement_import
      end

      def destroy
        @entitlement_import = load_and_authorize_entitlement_import

        if @entitlement_import.destroy
          head :no_content
        else
          # :nocov:
          render_single_resource @entitlement_import
          # :nocov:
        end
      end
    end
  end
end
