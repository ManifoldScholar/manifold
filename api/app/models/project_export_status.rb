# frozen_string_literal: true

class ProjectExportStatus < ApplicationRecord
  include ExportStatusView

  configure!
end
