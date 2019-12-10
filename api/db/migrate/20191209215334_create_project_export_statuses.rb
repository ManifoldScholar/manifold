class CreateProjectExportStatuses < ActiveRecord::Migration[5.2]
  def change
    create_view :project_export_statuses
  end
end
