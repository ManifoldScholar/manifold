# frozen_string_literal: true

module API
  module V1
    module Lti
      class DeepLinkingController < ApplicationController
        before_action :authenticate_request!

        def create
          result = ::Lti::DeepLinking::Submission.new(submission_params, current_user).call

          result.either(
            ->(_success) { head :accepted },
            ->(failure) { render json: { errors: failure[:errors] }, status: failure[:status] }
          )
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
