# frozen_string_literal: true

class UnstickyEntitlementDerivedRoles < ActiveRecord::Migration[6.0]
  GRANT_QUERY = <<~SQL
  WITH refreshing AS (
    SELECT gen_random_uuid() AS refresh_key, CURRENT_TIMESTAMP AS refreshed_at
  ), derived_grants AS (
    SELECT user_id, entitlement_role_id, resource_id, resource_type, role_name, role_kind,
      COALESCE(
        (
          array_agg(current_state ORDER BY cs.position)
        )[1],
        'pending'
      ) AS current_state,
      bool_and(expired) AS expired,
      bool_and(inferred) AS inferred,
      bool_or(expired) AS has_ever_been_expired,
      bool_or(inferred) AS has_ever_been_inferred,
      COUNT(DISTINCT entitlement_id) FILTER (WHERE current_state = 'active') AS active_entitlements_count,
      COUNT(DISTINCT entitlement_id) FILTER (WHERE current_state = 'expiring_soon') AS expiring_soon_entitlements_count,
      COUNT(DISTINCT entitlement_id) FILTER (WHERE current_state = 'expired') AS expired_entitlements_count,
      MIN(granted_at) AS first_granted_at,
      MAX(expired_at) AS last_expired_at,
      jsonb_agg(DISTINCT s.summary) AS summaries
      FROM entitlement_derived_roles
      LEFT JOIN LATERAL (
        SELECT
          CASE current_state
          WHEN 'active' THEN 1
          WHEN 'expiring_soon' THEN 2
          WHEN 'expired' THEN 3
          ELSE
            5
          END AS position
      ) cs ON true
      LEFT JOIN LATERAL (
        SELECT jsonb_build_object('current_state', current_state, 'entitlement_id', entitlement_id, 'expired', expired, 'expires_on', expires_on, 'expired_at', expired_at, 'granted_at', granted_at) AS summary
        ORDER BY expired_at DESC NULLS FIRST, cs.position ASC, expires_on DESC NULLS FIRST
      ) s ON true
      GROUP BY 1, 2, 3, 4, 5, 6
  ) INSERT INTO entitlement_grants (
      user_id, entitlement_role_id, resource_id, resource_type, role_name, role_kind,
      current_state, expired, inferred, has_ever_been_expired, has_ever_been_inferred,
      active_entitlements_count, expiring_soon_entitlements_count, expired_entitlements_count,
      first_granted_at, last_expired_at, summaries, refresh_key, refreshed_at
    )
    SELECT
      user_id, entitlement_role_id, resource_id, resource_type, role_name, role_kind,
      current_state, expired, inferred, has_ever_been_expired, has_ever_been_inferred,
      active_entitlements_count, expiring_soon_entitlements_count, expired_entitlements_count,
      first_granted_at, last_expired_at, summaries, refreshing.refresh_key, refreshing.refreshed_at
      FROM derived_grants
      CROSS JOIN refreshing
    ON CONFLICT (user_id, entitlement_role_id, resource_id, resource_type, role_name, role_kind) DO UPDATE SET
      current_state = EXCLUDED.current_state,
      expired = EXCLUDED.expired,
      inferred = EXCLUDED.inferred,
      has_ever_been_expired = EXCLUDED.has_ever_been_expired,
      has_ever_been_inferred = EXCLUDED.has_ever_been_inferred,
      active_entitlements_count = EXCLUDED.active_entitlements_count,
      expiring_soon_entitlements_count = EXCLUDED.expiring_soon_entitlements_count,
      expired_entitlements_count = EXCLUDED.expired_entitlements_count,
      first_granted_at = EXCLUDED.first_granted_at,
      last_expired_at = EXCLUDED.last_expired_at,
      summaries = EXCLUDED.summaries,
      refresh_key = EXCLUDED.refresh_key,
      refreshed_at = EXCLUDED.refreshed_at
  SQL

  def change
    reversible do |dir|
      dir.down do
        change_table :entitlement_grants do |t|
          t.index %i[user_id entitlement_role_id resource_id resource_type role_name role_kind], unique: true, name: "entitlement_grants_pkey"
        end

        change_table :entitlement_grant_audits do |t|
          t.index %i[user_id entitlement_role_id resource_id resource_type role_name], unique: true, name: "entitlement_grant_audits_pkey"
          t.index :action
        end
      end
    end

    drop_view :entitlement_grant_audits, revert_to_version: 1, materialized: true

    drop_view :entitlement_grants, revert_to_version: 1, materialized: true

    create_table :entitlement_grants, id: false do |t|
      t.references :user, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references :entitlement_role, null: false, type: :uuid, foreign_key: { on_delete: :restrict }
      t.references :resource, null: false, type: :uuid, polymorphic: true
      t.text :role_name, null: false
      t.text :role_kind, null: false
      t.text :current_state, null: false
      t.boolean :expired, null: false, default: false
      t.boolean :inferred, null: false, default: false
      t.boolean :has_ever_been_expired, null: false, default: false
      t.boolean :has_ever_been_inferred, null: false, default: false
      t.bigint :active_entitlements_count, null: false, default: 0
      t.bigint :expiring_soon_entitlements_count, null: false, default: 0
      t.bigint :expired_entitlements_count, null: false, default: 0
      t.timestamp :first_granted_at, precision: 6
      t.timestamp :last_expired_at, precision: 6
      t.uuid :refresh_key, null: false
      t.timestamp :refreshed_at, null: false, precision: 6
      t.jsonb :summaries, null: false, default: []

      t.index %i[user_id entitlement_role_id resource_id resource_type role_name role_kind], unique: true, name: "entitlement_grants_pkey"
      t.index %i[refreshed_at refresh_key], name: "index_entitlement_grants_refreshing", order: { refreshed_at: :desc }
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating entitlement grants" do
          exec_update(GRANT_QUERY)
        end
      end
    end

    create_view :entitlement_grant_audits, materialized: true

    change_table :entitlement_grant_audits do |t|
      t.index %i[user_id entitlement_role_id resource_id resource_type role_name], unique: true, name: "entitlement_grant_audits_pkey"
      t.index :action
    end
  end
end
