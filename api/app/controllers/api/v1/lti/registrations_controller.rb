# frozen_string_literal: true

module API
  module V1
    module Lti
      class RegistrationsController < ApplicationController
        resourceful! LtiRegistration do
          LtiRegistration.includes(:lti_deployments).order(created_at: :desc)
        end

        authority_actions approve: :update, deny: :update, block: :update

        def index
          render_multiple_resources(load_lti_registrations)
        end

        def show
          render_single_resource(lti_registration)
        end

        def destroy
          render_destruction_of(lti_registration)
        end

        def approve
          perform_transition(:approved)
        end

        def deny
          perform_transition(:denied)
        end

        def block
          perform_transition(:blocked)
        end

        private

        def perform_transition(state)
          lti_registration.transition_to!(state)

          render_single_resource(lti_registration)
        rescue Statesman::TransitionFailedError, Statesman::GuardFailedError => e
          render_transition_error(e)
        end

        def render_transition_error(error)
          errors = [{ code: :invalid_lti_registration_transition, title: "Cannot Transition Registration", detail: error.message }]

          render json: { errors: errors }, status: :unprocessable_entity
        end

        def lti_registration
          @lti_registration ||= load_and_authorize_lti_registration
        end
      end
    end
  end
end
