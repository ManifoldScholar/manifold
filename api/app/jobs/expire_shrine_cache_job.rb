# This will expire all files in the `Shrine` cache that have not
# been promoted to permanent storage by a certain date.
class ExpireShrineCacheJob < ApplicationJob
  queue_as :low_priority

  # The oldest files are allowed to be
  EXPIRATION_TIME = 2.days.freeze

  # @return [void]
  def perform
    shrine_cache = Shrine.storages[:cache]
    shrine_cache.clear! { |path| path.mtime < Time.now - EXPIRATION_TIME.ago }
  end
end
