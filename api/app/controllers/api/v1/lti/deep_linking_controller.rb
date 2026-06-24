# frozen_string_literal: true

module API
  module V1
    module Lti
      class DeepLinkingController < ApplicationController
        before_action :authenticate_request!

        def show
          result = ::Lti::DeepLinking::FetchContext.new(params[:context_token], current_user).call

          render_result(result)
        end

        def create
          result = ::Lti::DeepLinking::HandleSubmission.new(submission_params, current_user).call

          render_result(result)
        end

        private

        def render_result(result)
          result.either(
            ->(success) { render json: success },
            ->(failure) { render json: { errors: failure[:errors] }, status: failure[:status] }
          )
        end

        def submission_params
          params.permit(
            :context_token,
            selection: [:type, :id, :title]
          )
        end
      end
    end
  end
end
