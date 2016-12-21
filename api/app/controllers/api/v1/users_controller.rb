module Api
  module V1
    # User controller
    class UsersController < ApplicationController

      resourceful! User, authorize_options: { except: [:create, :show, :whoami] } do
        User
          .filtered(user_filter_params[:filter])
          .page(page_number)
          .per(page_size)
      end

      def whoami
        render_single_resource(@current_user)
      end

      def index
        @users = load_users
        render_multiple_resources(
          @users,
          each_serializer: UserSerializer
        )
      end

      def show
        @user = load_and_authorize_user
        render_single_resource @user
      end

      def create
        @user = ::Updaters::User.new(user_params).update(User.new)
        render_single_resource @user
      end

      def update
        @user = load_and_authorize_user
        ::Updaters::User.new(user_params).update(@user)
        render_single_resource @user
      end
    end
  end
end
