module API
  module V1
    # Passwords controller
    class PasswordsController < ApplicationController
      include Resourceful

      resourceful! User, authorize_options:
        { only: [:admin_reset_password], actions: { admin_reset_password: :update } }

      def create
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
        return invalid_token_error unless user&.valid_token?

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
