class CreatePages < ActiveRecord::Migration[5.0]
  def change
    create_table :pages do |t|
      t.string :title
      t.string :nav_title
      t.boolean :show_in_footer, default: false
      t.boolean :show_in_header, default: false
      t.string :slug
      t.boolean :hidden, default: false
      t.text :body
      t.timestamps
    end
    add_index :pages, [:slug], :unique => true
  end
end
