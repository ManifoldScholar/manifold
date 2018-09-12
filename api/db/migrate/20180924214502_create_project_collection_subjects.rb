class CreateProjectCollectionSubjects < ActiveRecord::Migration[5.0]
  def change
    create_table :project_collection_subjects do |t|
      t.belongs_to :project_collection, type: :uuid, null: false
      t.belongs_to :subject, type: :uuid, null: false
      t.timestamps

      add_index :collection_projects, [:project_id, :project_collection_id], name: "by_project_and_project_collection", unique: true
    end
  end
end
