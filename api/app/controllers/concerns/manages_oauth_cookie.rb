# frozen_string_literal: true

module ManagesOauthCookie
  extend ActiveSupport::Concern

  OAUTH_CACHE_KEY_PREFIX = "_oauth"
  OAUTH_COOKIE_NAME = "_oauth_auth_code"

  included do
    include ActionController::Cookies
  end

  def auth_code_cache_key(code = params[:auth_code])
    "#{OAUTH_CACHE_KEY_PREFIX}_#{code}"
  end

  def set_auth_code(user)
    code = SecureRandom.hex(32)
    cookies[OAUTH_COOKIE_NAME] = {
      value: code,
      expires: 1.minute,
      domain: :all
    }
    Rails.cache.write(auth_code_cache_key(code), user.id)
  end

  def get_user_id_for_auth_code(code = params[:auth_code])
    Rails.cache.read(auth_code_cache_key(code))
  end

  def clean_up_auth_code!(code = params[:auth_code])
    Rails.cache.delete(auth_code_cache_key(code))
    cookies.delete(OAUTH_COOKIE_NAME, domain: :all)
  end

end
