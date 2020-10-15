module Attachments
  class DestroyAttachmentJob < ApplicationJob
    def perform(attacher_klass, data)
      attacher_class = Object.const_get(attacher_klass)
      attacher = attacher_class.from_data(data)
      attacher.destroy
    end
  end
end
