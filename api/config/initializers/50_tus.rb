require "tus/storage/filesystem"

# rubocop:disable Style/NumericLiteralPrefix
Tus::Server.opts[:storage] = Tus::Storage::Filesystem.new(
  "data",
  permissions: 0600,
  directory_permissions: 0755
)
# rubocop:enable Style/NumericLiteralPrefix
