# @abstract
class TusUploader < Shrine
  plugin :tus
  # use Shrine::Storage::Tus for temporary storage
  storages[:cache] = storages[:tus]

  # Ensure that all uploads from tus get removed
  # after promotion

end
