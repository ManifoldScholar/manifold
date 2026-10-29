# frozen_string_literal: true

class UpdateTextExportStatusesToVersion2 < ActiveRecord::Migration[7.0]
  def change
    update_view :text_export_statuses, version: 2, revert_to_version: 1
  end
end
