# frozen_string_literal: true

require "auth_token"

module API
  module V1
    # Authentication token controller
    class TokensController < ApplicationController
      include Authentication

      def create
        authenticated_user = user_by_credentials || user_by_auth_code
        render_authenticated_user(authenticated_user)
      rescue StandardError => e
        render_error_response e
      end

      private

      def user_by_credentials
        return if token_params[:email].blank?

        User.find_by(email: token_params[:email]).try(:authenticate, token_params[:password])
      end

      def user_by_auth_code
        return if session[:auth_code].blank?

        user_id = Rails.cache.delete(session.delete(:auth_code))
        return if user_id.blank?

        User.find_by(id: user_id)
      end

      def token_params
        params.permit(:email, :password)
      end
    end
  end
end
