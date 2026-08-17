# frozen_string_literal: true

module API
  module V1
    module Lti
      class RegistrationsController < ApplicationController
        resourceful! LtiRegistration do
          LtiRegistration.includes(:lti_deployments).order(created_at: :desc)
        end

        def index
          @registrations = load_lti_registrations
          render_multiple_resources(@registrations)
        end

        def show
          @registration = load_and_authorize_lti_registration
          render_single_resource(@registration)
        end

        def update
          @registration = load_and_authorize_lti_registration
          ::Updaters::Default.new(registration_params).update(@registration)
          render_single_resource(@registration)
        end

        def destroy
          @registration = load_and_authorize_lti_registration
          blocklist_issuer!(@registration) if truthy?(params[:blocklist])
          render_destruction_of(@registration)
        end

        private

        def registration_params
          params.permit(data: { attributes: [:enabled] })
        end

        def blocklist_issuer!(registration)
          host = ::Lti::IssuerPolicy.normalize_host(registration.issuer)
          return if host.blank?

          settings = Settings.instance
          blocklist = settings.lti.issuer_blocklist
          return if blocklist.include?(host)

          settings.update!(lti: settings.lti.attributes.merge("issuer_blocklist" => blocklist + [host]))
        end

        def truthy?(value)
          ActiveModel::Type::Boolean.new.cast(value)
        end
      end
    end
  end
end
