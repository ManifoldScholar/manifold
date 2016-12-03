module Api
  module V1
    # User controller
    class UsersController < ApplicationController

      resourceful! User, authorize_options: { except: [:create, :whoami] }

      def whoami
        render_single_resource(@current_user)
      end

      def show
        @user = load_and_authorize_user
        render_single_resource(@user)
      end

      def create
        @user = ::Updaters::User.new(user_params).update(User.new)
        render_single_resource @user
      end

    end
  end
end
