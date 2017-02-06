class AddSpineDefaultToText < ActiveRecord::Migration[5.0]
  def up
    change_column :texts, :spine, :string, array: true, default: []
  end

  def down
    change_column :texts, :spine, :string, array: true, default: nil
  end
end
