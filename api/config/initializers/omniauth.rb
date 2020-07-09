ManifoldEnv.oauth.configure do |config|
  config.provider :facebook do |provider|
    provider.strategy_options do |hsh|
      hsh[:scope] = "email"

      # Affects the window size of the OAuth authorization
      # prompt from Facebook. We use a popup window in the
      # frontend.
      hsh[:display] = "popup"

      # The fields we want to request from Facebook.
      hsh[:info_fields] = %w(name email first_name last_name).join(",")
    end
  end

  config.provider :google do |provider|
    provider.strategy_name :google_oauth2

    provider.strategy_options do |hsh|
      # The user will always be prompted to select a user account
      # when authenticating, given the prevalence of people having
      # potentially more than one Google account in their browser
      # session.
      hsh[:prompt] = "select_account"
    end
  end

  config.provider :twitter
end

Rails.application.configure do
  config.middleware.insert_before ActionDispatch::RemoteIp, OmniauthStack
end
