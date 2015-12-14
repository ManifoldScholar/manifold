class AddSourceJsonToTextSections < ActiveRecord::Migration
  def change
    add_column :text_sections, :body_json, :text
  end
end
