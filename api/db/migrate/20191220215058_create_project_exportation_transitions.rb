class CreateProjectExportationTransitions < ActiveRecord::Migration[5.2]
  def change
    create_table :project_exportation_transitions, id: :uuid do |t|
      t.text        :to_state, null: false
      t.jsonb       :metadata, default: {}
      t.integer     :sort_key, null: false
      t.references  :project_exportation, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.boolean     :most_recent, null: false

      # If you decide not to include an updated timestamp column in your transition
      # table, you'll need to configure the `updated_timestamp_column` setting in your
      # migration class.
      t.timestamps null: false

      t.index %i[project_exportation_id sort_key], unique: true, name: "index_project_exportation_transitions_parent_sort"
      t.index %i[project_exportation_id most_recent], unique: true, where: "most_recent", name: "index_project_exportation_transitions_parent_most_recent"
    end
  end
end
