# frozen_string_literal: true

# Should only read from
class ManifoldConfig < ApplicationConfig
  env_prefix ""

  # These values are expected in the environment
  attr_config(
    :disable_spring,
    :ci,
    :client_url,
    :client_browser_api_url,
    :mammoth_path,
    :test_env_number,
    :manage_settings_from_env,
    :ci,
    :ssl_enabled
  )
  attr_config(
    domain: ((Rails.env.development? || Rails.env.test?) ? "manifold.lvh" : ""), # rubocop:disable Style/TernaryParentheses
    mammoth_path: Rails.root.join("..", "client/node_modules/mammoth/bin/mammoth")
)

  # These values are expected in 'manifold.yml'
  attr_config :citation_styles, :google, :html_validator, :css_validator, :attachments

  coerce_types(
    html_validator: config_mash,
    css_validator: config_mash,
    attachments: config_mash,
    manage_settings_from_env: :boolean,
    ssl_enabled: :boolean
  )
  def protocol
    ssl_enabled ? "https" : "http"
  end

  def url
    client_url || "#{ssl_enabled ? 'https' : 'http'}://#{domain}"
  end

  def api_url
    client_browser_api_url || url
  end

  def url_options
    {
      protocol: protocol,
      host: domain
    }
  end


  on_load do

    add_missing_mime = ->(definition, content_type) do
      definition[:allowed_mime] |= [content_type]
    end

    attachments.validations.each do |(type, definition)|
      # Ensure we import the original YAML manifest
      add_missing_mime[definition, "application/x-yaml"] if type == "resource"

      # Ensure text/markdown is present where it should be
      add_missing_mime[definition, "text/markdown"] if "application/markdown".in?(definition[:allowed_mime])
    end
  end
end
