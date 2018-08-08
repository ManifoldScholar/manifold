# This will expire all uploads that have not
# already been promoted from `tus` storage.
class ExpireTusUploadsJob < ApplicationJob
  queue_as :low_priority

  # The oldest files are allowed to be
  EXPIRATION_TIME = 2.days.freeze

  # @return [void]
  def perform
    tus_storage = Tus::Server.opts[:storage]

    tus_storage.expire_files EXPIRATION_TIME.ago
  end
end
