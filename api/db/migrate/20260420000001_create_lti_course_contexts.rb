# frozen_string_literal: true

class CreateLtiCourseContexts < ActiveRecord::Migration[7.0]
  def change
    create_table :lti_course_contexts, id: :uuid do |t|
      t.references :lti_deployment, type: :uuid, null: false, foreign_key: { on_delete: :cascade }

      t.text :context_id, null: false

      t.references :reading_group, type: :uuid, null: true, foreign_key: { to_table: :reading_groups, on_delete: :nullify }

      t.text :context_title
      t.text :context_label
      t.text :context_type

      t.datetime :last_synced_at

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index [:lti_deployment_id, :context_id], unique: true, name: "index_lti_course_contexts_on_deployment_and_context"
    end
  end
end
