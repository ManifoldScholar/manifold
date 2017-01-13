# Provides a serialization of a page model.
class SettingsSerializer < ActiveModel::Serializer
  attributes :general, :client
end
