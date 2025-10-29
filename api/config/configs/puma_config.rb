# frozen_string_literal: true
require_relative "application_config"
require_relative "api_config"

class PumaConfig < ApplicationConfig
  env_prefix ""

  attr_config :worker_count
  attr_config(puma_application: "API")

  def application
    choices = { "API" => ApiConfig }
    @application ||= choices[puma_application]
    @application
  end
end

