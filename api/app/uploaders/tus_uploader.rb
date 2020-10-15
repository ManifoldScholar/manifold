# @abstract
class TusUploader < Shrine
  plugin :tus

  # use Shrine::Storage::Tus for temporary storage
  storages[:cache] = storages[:tus]

  # Ensure that all uploads from tus get removed
  # after promotion

  class Attacher
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def tus_url_to_storage_id(tus_url, storage)
      tus_uid = tus_url.split("/").last

      if defined?(Shrine::Storage::FileSystem) && storage.is_a?(Shrine::Storage::FileSystem)
        tus_uid
      elsif defined?(Shrine::Storage::Gridfs) && storage.is_a?(Shrine::Storage::Gridfs)
        grid_info = storage.bucket.find(filename: tus_uid).limit(1).first
        grid_info[:_id].to_s
      elsif defined?(Shrine::Storage::S3) && storage.is_a?(Shrine::Storage::S3)
        tus_uid
      elsif defined?(Shrine::Storage::GoogleCloudStorage) && storage.is_a?(Shrine::Storage::GoogleCloudStorage)
        tus_uid
      else
        raise Shrine::Error, "undefined conversion of tus URL to storage id for storage #{storage.inspect}"
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end

end
