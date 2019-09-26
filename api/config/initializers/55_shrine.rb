require "shrine/storage/file_system"
require "shrine/storage/memory"
require "shrine/storage/tus"

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new("public", prefix: "system/cache"),
  store: Shrine::Storage::FileSystem.new("public", prefix: "system")
}

Shrine.storages[:tus] =
  if Rails.env.test?
    Shrine::Storage::Memory.new
  else
    Shrine::Storage::FileSystem.new("data")
  end

Shrine.plugin :activerecord
Shrine.plugin :parsed_json
Shrine.plugin :refresh_metadata
Shrine.plugin :signature
