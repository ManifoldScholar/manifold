# @abstract
class TusUploader < Shrine
  # use Shrine::Storage::Tus for temporary storage
  storages[:cache] = storages[:tus]
end
