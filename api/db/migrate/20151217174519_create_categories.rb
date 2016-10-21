class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories, id: :uuid do |t|
      t.uuid :project_id
      t.string :title
      t.string :role
    end
  end
end
