# Provides a serialization of a page model.
class SettingsSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :general, :press_logo_url, :theme

  # Singleton objects return 0 as their ID when serialized.
  def id
    0
  end

end
