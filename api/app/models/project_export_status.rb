class ProjectExportStatus < ApplicationRecord
  include Concerns::ExportStatusView

  configure!
end
