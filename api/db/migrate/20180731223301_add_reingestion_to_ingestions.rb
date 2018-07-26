class AddReingestionToIngestions < ActiveRecord::Migration[5.0]
  def change
    add_column :ingestions, :reingestion, :boolean, default: false, null: false
  end
end
