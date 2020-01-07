class CreateProjectExportations < ActiveRecord::Migration[5.2]
  def change
    create_table :project_exportations, id: :uuid do |t|
      t.references :project,        null: false,  type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :export_target,  null: false,  type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :project_export, null: true,   type: :uuid, foreign_key: { on_delete: :nullify }
      t.references :user,           null: true,   type: :uuid, foreign_key: { on_delete: :nullify }

      t.timestamp :exported_at

      t.jsonb :logs, null: false, default: {}

      t.timestamps

      t.index %i[project_id export_target_id], name: :index_project_exportations_targeted_projects
    end
  end
end
