class AddKindToTextSections < ActiveRecord::Migration[5.0]
  def change
    add_column :text_sections, :kind, :string
  end
end
