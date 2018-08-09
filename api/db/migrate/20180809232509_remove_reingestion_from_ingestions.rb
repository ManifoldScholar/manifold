class RemoveReingestionFromIngestions < ActiveRecord::Migration[5.0]
  def change
    remove_column :ingestions, :reingestion, :boolean, default: false, null: false
  end
end
