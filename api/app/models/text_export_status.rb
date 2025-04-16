# frozen_string_literal: true

class TextExportStatus < ApplicationRecord
  include ExportStatusView

  configure!
end
