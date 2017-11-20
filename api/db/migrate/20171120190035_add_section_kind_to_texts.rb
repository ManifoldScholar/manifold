class AddSectionKindToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :section_kind, :string
  end
end
