# frozen_string_literal: true

class StartupConfig < ApplicationConfig
  env_prefix ""
  attr_config(
    :domain,
    :disable_spring,
    :ci,
    :client_url,
    :client_browser_api_url,
    :mammoth_path,
    :test_env_number,
    :manage_settings_from_env
  )

  coerce_types manage_settings_from_env: :boolean
end
