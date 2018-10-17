module Attachments
  class ProcessAttachmentJob < ApplicationJob
    queue_as :default

    def perform(data)
      AttachmentUploader::Attacher.promote data
    end
  end
end
