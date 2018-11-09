class AddFaviconToSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :settings, :favicon_data, :jsonb, default: {}
  end
end
