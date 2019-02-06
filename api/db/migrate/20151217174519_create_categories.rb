class CreateCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :categories, id: :uuid do |t|
      t.uuid :project_id
      t.string :title
      t.string :role
    end
  end
end
