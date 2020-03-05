class CreateEntitlementTransitions < ActiveRecord::Migration[5.2]
  def change
    create_table :entitlement_transitions do |t|
      t.references :entitlement,  null: false, type: :uuid, on_delete: :cascade
      t.integer    :sort_key,     null: false
      t.boolean    :most_recent,  null: false
      t.text       :to_state,     null: false
      t.jsonb      :metadata,     null: false, default: {}

      # If you decide not to include an updated timestamp column in your transition
      # table, you'll need to configure the `updated_timestamp_column` setting in your
      # migration class.
      t.timestamps null: false

      t.index %i[entitlement_id sort_key], unique: true, name: "index_entitlement_transitions_parent_sort"
      t.index %i[entitlement_id most_recent], unique: true, where: %[most_recent], name: "index_entitlement_transitions_parent_most_recent"
    end
  end
end
