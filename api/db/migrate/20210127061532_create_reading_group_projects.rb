class CreateReadingGroupProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :reading_group_projects, id: :uuid do |t|
      t.references :reading_group, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :project, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :reading_group_category, null: true, type: :uuid, foreign_key: { on_delete: :nullify }
      t.integer :position

      t.timestamps

      t.index %i[reading_group_id project_id], unique: true, name: "index_reading_group_projects_uniqueness"
      t.index %i[reading_group_id reading_group_category_id position], name: "index_reading_group_projects_ordering"
    end
  end
end
