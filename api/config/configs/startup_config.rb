# frozen_string_literal: true
require_relative "application_config"

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
    :manage_settings_from_env,
    :ci
  )

  coerce_types manage_settings_from_env: :boolean
end
