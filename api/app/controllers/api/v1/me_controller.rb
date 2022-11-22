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
        ::Updaters::User.new(user_params).update(current_user)
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
