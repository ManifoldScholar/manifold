class AddKindToTextSections < ActiveRecord::Migration
  def change
    add_column :text_sections, :kind, :string
  end
end
