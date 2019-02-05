module ApplicationCable
  class Channel < ActionCable::Channel::Base

    def initialize(connection, identifier, params = {})
      super
      Rails.logger.info("params: #{params}")
      load_current_user(params[:token])
    end

    attr_reader :current_user

    def load_current_user(encrypted_token)
      return if @current_user

      token = AuthToken.decode(encrypted_token)
      @current_user = User.find(token[:user_id])
    end

  end
end
