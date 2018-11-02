module Attachments
  class ProcessAttachmentJob < ApplicationJob
    include Concerns::ExclusiveJob

    queue_as :default

    def perform(data)
      AttachmentUploader::Attacher.promote data
    end

    def exclusive_lock_name
      klass, id = *arguments.dig(0, 'record')

      return super unless klass.present? && id.present?

      "#{super}:#{klass}:#{id}"
    end
  end
end
