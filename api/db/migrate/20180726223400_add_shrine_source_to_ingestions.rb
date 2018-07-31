class AddShrineSourceToIngestions < ActiveRecord::Migration[5.0]
  def change
    add_column :ingestions, :source_data, :jsonb, null: false, default: {}

    remove_column :ingestions, :source_file_name, :string
    remove_column :ingestions, :source_content_type, :string
    remove_column :ingestions, :source_file_size, :integer
    remove_column :ingestions, :source_updated_at, :timestamp
  end
end
