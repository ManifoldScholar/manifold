# frozen_string_literal: true

module API
  module V1
    # Me controller
    class MeController < ApplicationController
      before_action :authenticate_request!

      def show
        if current_user
          render_jsonapi current_user,
                         serializer: ::V1::CurrentUserSerializer,
                         include: includes
        else
          render status: :unauthorized
        end
      end

      def update
        # Disallow self-update of email unless permitted
        params = user_params.to_h
        params.dig(:data, :attributes)&.delete(:email) if Settings.current.disallow_email_change
        ::Updaters::User.new(params).update(current_user)
        if current_user.valid?
          render_jsonapi current_user,
                         serializer: ::V1::CurrentUserSerializer,
                         include: includes
        else
          render_jsonapi current_user,
                         serializer: ::V1::ErrorSerializer,
                         status: :unprocessable_entity
        end
      end

      def destroy
        current_user&.destroy
      end

      private

      def includes
        [:collection, :favorites]
      end
    end
  end
end
