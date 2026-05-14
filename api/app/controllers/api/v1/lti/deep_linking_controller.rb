# frozen_string_literal: true

module API
  module V1
    module Lti
      class DeepLinkingController < ApplicationController
        before_action :authenticate_request!

        def create
          result = Auth::Lti::PickerSubmission.new(submission_params, current_user).call

          if result.ok
            head :accepted
          else
            render json: { errors: result.errors }, status: result.status
          end
        end

        private

        def submission_params
          params.permit(
            :context_token,
            :reading_group_id,
            selection: [:type, :id, :title]
          )
        end
      end
    end
  end
end
