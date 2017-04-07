class AddSlugToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :slug, :string
    add_index :texts, :slug, unique: true
  end
end
