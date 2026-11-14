# frozen_string_literal: true

class CreateLtiRegistrationTransitions < ActiveRecord::Migration[7.0]
  def change
    create_table :lti_registration_transitions, id: :uuid do |t|
      t.references :lti_registration, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: false
      t.boolean :most_recent, null: false, default: false
      t.integer :sort_key, null: false
      t.string :to_state, null: false
      t.jsonb :metadata

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %i(lti_registration_id sort_key), unique: true, name: "index_lti_registration_transitions_parent_sort"
      t.index %i(lti_registration_id most_recent), unique: true, where: "most_recent", name: "index_lti_registration_transitions_parent_most_recent"
    end

    remove_column :lti_registrations, :enabled, :boolean, null: false, default: true
  end
end
