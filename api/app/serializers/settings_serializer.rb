# Provides a serialization of a page model.
class SettingsSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :general, :theme, :integrations, :secrets, :email, :calculated,
             :press_logo_styles, :press_logo_footer_styles, :press_logo_mobile_styles,
             :favicon_styles

  attribute :oauth

  # Singleton objects return 0 as their ID when serialized.
  def id
    0
  end

  def secrets
    object.secrets.transform_values do |_value|
      "(redacted)"
    end
  end

  def oauth
    ManifoldEnv.oauth.as_json
  end
end
