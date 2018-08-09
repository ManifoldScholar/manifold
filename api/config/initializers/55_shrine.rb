require "shrine/storage/file_system"
require "shrine/storage/memory"
require "shrine/storage/tus"
require Rails.root.join "lib", "paperclip_migrator"

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

Shrine.plugin :activerecord
Shrine.plugin :parsed_json
Shrine.plugin :refresh_metadata
Shrine.plugin :signature
