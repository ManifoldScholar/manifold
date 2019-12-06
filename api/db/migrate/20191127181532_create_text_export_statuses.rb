class CreateTextExportStatuses < ActiveRecord::Migration[5.2]
  def change
    create_view :text_export_statuses
  end
end
