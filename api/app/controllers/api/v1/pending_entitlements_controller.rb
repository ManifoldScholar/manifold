# frozen_string_literal: true

module API
  module V1
    class PendingEntitlementsController < ApplicationController
      INCLUSIONS = [
        :transitions,
        :user,
        :entitlement,
        :subject,
      ].freeze

      INCLUDES = %i[entitlement user subject].freeze

      resourceful! PendingEntitlement, authorize_options: { except: [:index] } do
        PendingEntitlement.preload(*INCLUSIONS).filtered(
          with_pagination!(
            pending_entitlement_filter_params
          )
        )
      end

      def index
        authorize_action_for PendingEntitlement, unscoped: true

        @pending_entitlements = load_pending_entitlements

        render_multiple_resources @pending_entitlements, include: INCLUDES
      end

      def show
        @pending_entitlement = load_and_authorize_pending_entitlement

        render_single_resource @pending_entitlement
      end

      def create
        @pending_entitlement = PendingEntitlement.new creator: current_user

        authorize_action_for @pending_entitlement

        @pending_entitlement = ::Updaters::PendingEntitlement.new(pending_entitlement_params).update(@pending_entitlement)

        render_single_resource @pending_entitlement
      end

      def destroy
        @pending_entitlement = load_and_authorize_pending_entitlement

        if @pending_entitlement.destroy
          head :no_content
        else
          # :nocov:
          render_single_resource @pending_entitlement
          # :nocov:
        end
      end
    end
  end
end
