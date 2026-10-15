# frozen_string_literal: true

class TextExportStatus < ApplicationRecord
  include ExportStatusView

  configure!

  scope :successful, -> { where(state: "success") }
  scope :current_successful_text_ids, -> { current.successful.select(:text_id) }
end
