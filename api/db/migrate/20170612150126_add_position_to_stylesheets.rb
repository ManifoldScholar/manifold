class AddPositionToStylesheets < ActiveRecord::Migration[5.0]
  def change
    add_column :stylesheets, :position, :integer
    Text.all.each do |text|
      text.stylesheets.each.with_index(1) do |stylesheet, index|
        stylesheet.update_column :position, index
      end
    end
  end
end
