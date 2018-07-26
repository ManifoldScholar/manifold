class CreateTextSectionStylesheets < ActiveRecord::Migration[5.0]
  def change
    create_table :text_section_stylesheets do |t|
      t.belongs_to :text_section, type: :uuid, null: false, index: true
      t.belongs_to :stylesheet, type: :uuid, null: false, index: true
      t.timestamps
    end
  end
end
