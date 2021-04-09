class AddIngestionToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :ingestion, :jsonb, default: {}
  end
end
