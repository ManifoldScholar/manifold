class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :title
      t.string :subtitle
      t.boolean :published, :null => false, :default => false
      t.datetime :published_datetime
      t.text :description
      t.string :cover_file_name
      t.string :cover_content_type
      t.integer :cover_file_size
      t.datetime :cover_updated_at
      t.timestamps
    end

    add_column :collaborators, :project_id, :integer
    add_column :texts, :project_id, :integer

  end
end
