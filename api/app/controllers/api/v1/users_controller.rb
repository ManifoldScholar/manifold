module Api
  module V1
    # User controller
    class UsersController < ApplicationController

      INCLUDES = %w(
        makers
      ).freeze

      resourceful! User, authorize_options: { except: [:create, :show, :whoami] } do
        User.filter(with_pagination!(user_filter_params))
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
        render_single_resource(@user, include: INCLUDES)
      end

      def create
        @user = ::Updaters::User.new(user_params).update(User.new)
        include_password = user_params.dig("data", "meta", "created_by_admin") == true
        AccountMailer.welcome(@user, include_password).deliver
        render_single_resource @user
      end

      def update
        @user = load_and_authorize_user
        ::Updaters::User.new(user_params).update(@user)
        render_single_resource(@user, include: INCLUDES)
      end

      def destroy
        @user = load_and_authorize_user
        @user.destroy
      end
    end
  end
end
