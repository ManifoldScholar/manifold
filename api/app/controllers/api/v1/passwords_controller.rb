# frozen_string_literal: true

module API
  module V1
    # Passwords controller
    class PasswordsController < ApplicationController
      include Resourceful

      resourceful! User, authorize_options:
        { only: [:admin_reset_password], actions: { admin_reset_password: :update } }

      def create
        return initiate_linked_reset if pending_identity_link

        if params[:email].present?
          @user = User.find_by(email: params[:email])
          @user&.generate_reset_token
          render status: :no_content
        else
          render json: { errors: [{ source: { pointer: "/data/email" },
                                    detail: "is required" }] },
                 status: :unprocessable_entity
        end
      end

      def update
        user = User.by_reset_token(params[:reset_token])
        return invalid_token_error unless user&.valid_token?(reset_token_ttl)

        user.update_password(params[:password], params[:password_confirmation])
        user.save
        render_single_resource user
      end

      def admin_reset_password
        @user = User.find(params[:id])
        @user.force_reset_password
        @user.save
        AccountMailer.password_change_notification(@user).deliver if @user.valid?
        render_single_resource(@user)
      end

      protected

      # The parked login is authoritative for whose account gets the reset, so the link-mode reset cannot
      # be aimed at an arbitrary email. Its TTL is refreshed so it outlives the (shortened) reset window.
      def initiate_linked_reset
        pending_identity_link.touch!
        User.find_by(id: pending_identity_link.user_id)
            &.generate_reset_token(account_link_token: pending_identity_link.token)
        render status: :no_content
      end

      def pending_identity_link
        return @pending_identity_link if defined?(@pending_identity_link)

        token = params[:account_link_token].presence
        @pending_identity_link = token ? ExternalAuth::PendingIdentityLink.find(token) : nil
      end

      def reset_token_ttl
        params[:account_link_token].present? ? ExternalAuth::PendingIdentityLink.cache_ttl : 1.hour
      end

      def invalid_token_error
        render json: {
          errors: [
            {
              source: { pointer: "/data/attributes/resetToken" },
              detail: "Invalid or expired"
            }
          ]
        }, status: :unprocessable_entity
      end
    end
  end
end
