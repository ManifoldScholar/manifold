# frozen_string_literal: true

require "shrine/storage/file_system"
require "shrine/storage/memory"
require "shrine/storage/tus"
require "shrine/storage/google_cloud_storage"
require "shrine/storage/s3"

require_relative "types"
require_relative "strategy"
require_relative "tus_gcs"

module Storage
  class Factory
    class << self
      DEFAULT_PATH = "public"
      DEFAULT_TUS_PATH = "data"
      PRIMARY_PREFIX = "system"
      MIRROR_PREFIX = "mirror"
      CACHE_PREFIX = "system/cache"
      TUS_PREFIX = "tus"

      def primary_store
        @primary_store ||= ::Storage::Strategy.primary
      end

      delegate :cloud?, :file?, :gcs?, :s3?, to: :primary_store, prefix: true

      def mirror_store
        @mirror_store ||= ::Storage::Strategy.mirror
      end

      delegate :cloud?, :file?, :gcs?, :s3?, to: :mirror_store, prefix: true, allow_nil: true

      def shrine_storages
        {
          cache: cache_storage,
          store: primary_storage,
          mirror: mirror_storage,
          tus: tus_storage
        }
      end

      def tus_server_storage
        return tus_server_gcs_storage if primary_store_gcs?
        return tus_server_s3_storage if primary_store_s3?

        tus_server_file_storage
      end

      def store_supports_move?
        primary_store_file?
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
        ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY_BUCKET"].presence || UploadConfig.bucket
      end

      def mirror_bucket
        ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR_BUCKET"].presence || UploadConfig.mirror_bucket || UploadConfig.bucket
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

      def mirror_store_enabled?
        mirror_store_cloud? || mirror_store_file?
      end

      def primary_storage
        return test_storage(primary_storage_path, primary_prefix) if test?
        return gcs_storage(primary_bucket, primary_prefix) if primary_store_gcs?
        return s3_storage(primary_bucket, primary_prefix) if primary_store_s3?

        file_storage(primary_storage_path, primary_prefix)
      end

      def mirror_storage
        return nil if test?
        return gcs_storage(mirror_bucket, mirror_prefix) if mirror_store_gcs?
        return s3_storage(mirror_bucket, mirror_prefix) if mirror_store_s3?
        return file_storage(mirror_storage_path, mirror_prefix) if mirror_store_file?

        nil
      end

      def cache_storage
        return test_storage(primary_storage_path, cache_prefix) if test?
        # Cache storage can not be memory store because we validate attachment extensions
        # in some cases. If we make it a memory store, Shrine converts the attachment to
        # StringIO internally, which causes validation to fail (no extension), and then
        # the attachment can't be promoted. This leads to test failures.
        return gcs_storage(cache_bucket, cache_prefix) if primary_store_gcs?
        return s3_storage(cache_bucket, cache_prefix) if primary_store_s3?

        file_storage(cache_storage_path, cache_prefix)
      end

      def tus_storage
        return test_storage(tus_storage_path, tus_prefix) if test?
        return gcs_storage(tus_bucket, tus_prefix) if primary_store_gcs?
        return s3_storage(tus_bucket, tus_prefix) if primary_store_s3?

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

      def tus_server_s3_storage
        Tus::Storage::S3.new(
          concurrency: { concatenation: 20 },
          logger: Rails.logger,
          **cache_s3_options,
          bucket: cache_bucket,
        )
      end

      private

      def file_storage(path, prefix)
        Shrine::Storage::FileSystem.new(path, prefix: prefix)
      end

      def gcs_storage(bucket, prefix)
        Shrine::Storage::GoogleCloudStorage.new(bucket: bucket, prefix: prefix, credentials: ::Factory::DriveSession.config)
      end

      def shared_s3_options
        aws_credentials = S3Config.to_h

        return {
          http_open_timeout: 30,
          retry_limit: 10,
          use_accelerate_endpoint: false,
          **aws_credentials
        }
      end

      def cache_s3_options
        { **shared_s3_options, bucket: cache_bucket, prefix: "cache" }
      end

      def store_s3_options
        { **shared_s3_options, bucket: primary_bucket, prefix: "store" }
      end

      def s3_storage(bucket, prefix)
        Shrine::Storage::S3.new(bucket:, **store_s3_options)
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
