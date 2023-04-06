class AddTextSectionToIngestion < ActiveRecord::Migration[6.0]
  def change
    change_table :ingestions do |t|
      t.uuid :text_section_id, foreign_key: true, on_delete: :nullify
      t.index :text_section_id
    end
  end
end
