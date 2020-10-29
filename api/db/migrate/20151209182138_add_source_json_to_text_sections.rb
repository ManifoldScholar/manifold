class AddSourceJSONToTextSections < ActiveRecord::Migration[5.0]
  def change
    add_column :text_sections, :body_json, :text
  end
end
