# Provides a serialization of a page model.
class SettingsSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :general, :press_logo_styles, :theme

  attribute :oauth

  # Singleton objects return 0 as their ID when serialized.
  def id
    0
  end

  def oauth
    ManifoldEnv.oauth.as_json
  end
end
