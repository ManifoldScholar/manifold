module API
  module V1
    # User controller
    class UsersController < ApplicationController

      PRELOADS = %w(roles).freeze

      resourceful! User, authorize_options: { except: [:create, :show, :whoami] } do
        User.preload(PRELOADS).filtered(with_pagination!(user_filter_params))
      end

      def whoami
        return respond_with_forbidden("the authenticated user", "show") unless @current_user

        render_single_resource(@current_user)
      end

      def index
        @users = load_users
        render_multiple_resources(
          @users
        )
      end

      def show
        @user = load_and_authorize_user
        render_single_resource @user
      end

      def create
        @user = ::Updaters::User.new(user_params).update(User.new)
        created_by_admin = user_params.dig("data", "meta", "created_by_admin") == true
        AccountMailer.welcome(@user, created_by_admin: created_by_admin).deliver if @user.valid?
        render_single_resource @user
      end

      def update
        @user = load_and_authorize_user
        ::Updaters::User.new(user_params).update(@user)
        render_single_resource @user
      end

      def destroy
        @user = load_and_authorize_user
        @user.destroy
      end
    end
  end
end
