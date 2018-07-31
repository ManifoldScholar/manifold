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
    Shrine::Storage::Tus.new(tus_storage: Tus::Server.opts[:storage])
  end
