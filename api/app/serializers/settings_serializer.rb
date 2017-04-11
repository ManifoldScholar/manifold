# Provides a serialization of a page model.
class SettingsSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :general, :theme, :features, :integrations, :secrets, :press_logo_styles

  # Singleton objects return 0 as their ID when serialized.
  def id
    0
  end

  def secrets
    object.secrets.map { |k, _str| [k, "(redacted)"] }.to_h
  end

  def oauth
    ManifoldEnv.oauth.as_json
  end
end
