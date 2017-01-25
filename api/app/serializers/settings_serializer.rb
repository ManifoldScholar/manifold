# Provides a serialization of a page model.
class SettingsSerializer < ActiveModel::Serializer
  attributes :general, :client

  # Singleton objects return 0 as their ID when serialized.
  def id
    0
  end

end
