class AddBackgroundColorToFeatures < ActiveRecord::Migration[5.0]
  def change
    add_column :features, :background_color, :string
    add_column :features, :foreground_color, :string
    add_column :features, :header_color, :string
    add_column :features, :layout, :string
    add_column :features, :foreground_top, :string
    add_column :features, :foreground_left, :string
    remove_column :features, :foreground_position, :integer
    remove_column :features, :foreground_top_padding, :integer
  end
end
