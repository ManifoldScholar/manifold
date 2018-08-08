# @abstract
class TusUploader < Shrine
  # use Shrine::Storage::Tus for temporary storage
  storages[:cache] = storages[:tus]

  # Ensure that all uploads from tus get removed
  # after promotion
  plugin :delete_promoted
end
