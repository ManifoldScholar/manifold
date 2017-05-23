class AddCitationFields < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :citations, :jsonb, default: {}
    add_column :projects, :citations, :jsonb, default: {}
    add_column :text_sections, :citations, :jsonb, default: {}
  end
end
