require "shrine/storage/file_system"
require "shrine/storage/memory"
require "shrine/storage/tus"
require "shrine/storage/google_cloud_storage"
require "storage/tus_gcs"

module Storage
  class Factory

    class << self

      DEFAULT_PATH = "public".freeze
      DEFAULT_TUS_PATH = "data".freeze
      PRIMARY_PREFIX = "system".freeze
      MIRROR_PREFIX = "mirror".freeze
      CACHE_PREFIX = "system/cache".freeze
      TUS_PREFIX = "tus".freeze

      def shrine_storages
        {
          cache: cache_storage,
          store: primary_storage,
          mirror: mirror_storage,
          tus: tus_storage
        }
      end

      def tus_server_storage
        return tus_server_gcs_storage if primary_store_is_gcs?
        return tus_server_aws_storage if primary_store_is_aws?

        tus_server_file_storage
      end

      def store_supports_move?
        primary_store_is_file?
      end

      def primary_store_is_gcs?
        ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY"]&.downcase == "gcs"
      end

      def primary_store_is_aws?
        ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY"]&.downcase == "gcs"
      end

      def mirror_store_is_gcs?
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR"]&.downcase == "gcs"
      end

      def mirror_store_is_aws?
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR"]&.downcase == "aws"
      end

      def mirror_store_is_file?
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR"]&.downcase == "file"
      end

      def mirror_storage_path
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR_PATH"] || DEFAULT_PATH
      end

      def primary_storage_path
        ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY_PATH"] || DEFAULT_PATH
      end

      def tus_storage_path
        ENV["MANIFOLD_SETTINGS_STORAGE_TUS_PATH"] || DEFAULT_TUS_PATH
      end

      def cache_storage_path
        ENV["MANIFOLD_SETTINGS_STORAGE_CACHE_PATH"] || DEFAULT_PATH
      end

      def primary_bucket
        ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY_BUCKET"]
      end

      def mirror_bucket
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR_BUCKET"]
      end

      def cache_bucket
        ENV["MANIFOLD_SETTINGS_STORAGE_CACHE_BUCKET"] || primary_bucket
      end

      def tus_bucket
        ENV["MANIFOLD_SETTINGS_STORAGE_TUS_BUCKET"] || primary_bucket
      end

      def primary_prefix
        ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY_PREFIX"] || PRIMARY_PREFIX
      end

      def mirror_prefix
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR_PREFIX"] || MIRROR_PREFIX
      end

      def cache_prefix
        ENV["MANIFOLD_SETTINGS_STORAGE_CACHE_PREFIX"] || CACHE_PREFIX
      end

      def tus_prefix
        ENV["MANIFOLD_SETTINGS_STORAGE_TUS_PREFIX"] || TUS_PREFIX
      end

      def primary_store_is_cloud?
        primary_store_is_gcs? || primary_store_is_aws?
      end

      def primary_store_is_file?
        !primary_store_is_cloud?
      end

      def mirror_store_is_cloud?
        mirror_store_is_gcs? || mirror_store_is_aws?
      end

      def mirror_store_enabled?
        mirror_store_is_cloud? || mirror_store_is_file?
      end

      def primary_storage
        return test_storage(primary_storage_path, primary_prefix) if test?
        return gcs_storage(primary_bucket, primary_prefix) if primary_store_is_gcs?
        return aws_storage(primary_bucket, primary_prefix) if primary_store_is_aws?

        file_storage(primary_storage_path, primary_prefix)
      end

      def mirror_storage
        return nil if test?
        return gcs_storage(mirror_bucket, mirror_prefix) if mirror_store_is_gcs?
        return aws_storage(mirror_bucket, mirror_prefix) if mirror_store_is_aws?
        return file_storage(mirror_storage_path, mirror_prefix) if mirror_store_is_file?

        nil
      end

      def cache_storage
        return test_storage(primary_storage_path, cache_prefix) if test?
        # Cache storage can not be memory store because we validate attachment extensions
        # in some cases. If we make it a memory store, Shrine converts the attachment to
        # StringIO internally, which causes validation to fail (no extension), and then
        # the attachment can't be promoted. This leads to test failures.
        return gcs_storage(cache_bucket, cache_prefix) if primary_store_is_gcs?
        return aws_storage(cache_bucket, cache_prefix) if primary_store_is_aws?

        file_storage(cache_storage_path, cache_prefix)
      end

      def tus_storage
        return test_storage(tus_storage_path, tus_prefix) if test?
        return gcs_storage(tus_bucket, tus_prefix) if primary_store_is_gcs?
        return aws_storage(tus_bucket, tus_prefix) if primary_store_is_aws?

        file_storage(tus_storage_path, tus_prefix)
      end

      def tus_server_file_storage
        ::Tus::Storage::Filesystem.new(
          File.join(tus_storage_path, tus_prefix),
          permissions: 0o600,
          directory_permissions: 0o755
        )
      end

      def tus_server_gcs_storage
        Storage::TusGcs.new(
          bucket: tus_bucket,
          prefix: tus_prefix,
          credentials: ::Factory::DriveSession.config
        )
      end

      def tus_server_aws_storage
        # TODO: Implement this
      end

      private

      def file_storage(path, prefix)
        Shrine::Storage::FileSystem.new(path, prefix: prefix)
      end

      def gcs_storage(bucket, prefix)
        Shrine::Storage::GoogleCloudStorage.new(bucket: bucket, prefix: prefix, credentials: ::Factory::DriveSession.config)
      end

      def aws_storage(bucket, prefix)
        # TODO: Implement
      end

      def test_storage(path, prefix)
        Shrine::Storage::FileSystem.new(Rails.root.join("tmp/shrine-test-storage", path), prefix: prefix)
      end

      def test?
        Rails.env.test?
      end

    end

  end
end
