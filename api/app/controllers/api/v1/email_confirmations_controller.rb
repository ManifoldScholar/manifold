# frozen_string_literal: true

module API
  module V1
    class EmailConfirmationsController < ApplicationController
      # Confirm the email (from clicking on a link).
      #
      # @see Users::ConfirmEmail
      def show
        @user = User.find params[:id]

        result = ManifoldApi::Container["users.confirm_email"].(@user, params[:token])

        url = Addressable::URI.parse(Rails.configuration.manifold.url)

        url.query_values = (url.query_values || {}).merge(email_confirmed: result.success?)

        redirect_to url.to_s
      end

      # Request a new email confirmation message
      #
      # @see Users::RequestEmailConfirmation
      def update
        @user = User.find params[:id]

        authorize_action_for @user, :update?

        @user.request_email_confirmation!

        head :no_content
      end
    end
  end
end
