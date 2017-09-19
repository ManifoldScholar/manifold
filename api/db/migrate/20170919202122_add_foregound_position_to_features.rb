class AddForegoundPositionToFeatures < ActiveRecord::Migration[5.0]
  def change
    add_column :features, :foreground_position, :string
  end
end
