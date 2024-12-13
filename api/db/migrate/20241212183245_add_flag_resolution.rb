# frozen_string_literal: true

class AddFlagResolution < ActiveRecord::Migration[6.1]
  FLAGGABLES = %i[annotations comments].freeze

  def change
    FLAGGABLES.each do |flaggable|
      prepare_new_flag_counts_for! flaggable
    end

    prune_flags_table!

    change_table :flags do |t|
      t.boolean :resolved_by_creator, null: false, default: false

      t.timestamp :resolved_at

      t.index %i[creator_id flaggable_type flaggable_id], unique: true, name: "index_flags_uniqueness"
      t.index :resolved_at

      t.foreign_key :users, column: :creator_id, on_delete: :cascade
    end

    change_column_null :flags, :creator_id, false
    change_column_null :flags, :flaggable_type, false
    change_column_null :flags, :flaggable_id, false

    reset_flag_status!
  end

  private

  def prepare_new_flag_counts_for!(flaggable)
    reversible do |dir|
      dir.up do
        say_with_time "Correcting any null flags_count for #{flaggable}" do
          exec_update(<<~SQL.strip_heredoc.strip)
          UPDATE #{flaggable} SET flags_count = 0 WHERE flags_count IS NULL;
          SQL
        end

        say_with_time "Normalizing count type for #{flaggable}" do
          execute(<<~SQL.strip_heredoc.strip)
          ALTER TABLE #{flaggable} ALTER COLUMN flags_count SET DATA TYPE bigint USING flags_count::bigint;
          SQL
        end
      end

      dir.down do
        say_with_time "Reverting count type for #{flaggable}" do
          execute(<<~SQL.strip_heredoc.strip)
          ALTER TABLE #{flaggable} ALTER COLUMN flags_count SET DATA TYPE integer USING flags_count::integer;
          SQL
        end
      end
    end

    change_column_null flaggable, :flags_count, false

    change_table flaggable do |t|
      t.bigint :resolved_flags_count, null: false, default: 0
      t.bigint :unresolved_flags_count, null: false, default: 0
      t.uuid :flagger_ids, null: false, default: [], array: true
    end
  end

  # This table may need some TLC to support stricter constraints on it with longer-running tenants.
  #
  # @return [void]
  def prune_flags_table!
    reversible do |dir|
      dir.up do
        say_with_time "Delete any flags that don't match existing users" do
          exec_delete(<<~SQL.strip_heredoc)
          DELETE FROM flags WHERE creator_id IS NULL OR creator_id NOT IN (SELECT id FROM users);
          SQL
        end

        say_with_time "Delete any possible flags that have no flaggable associated" do
          exec_delete(<<~SQL.strip_heredoc)
          DELETE FROM flags WHERE
            CASE flaggable_type
            WHEN 'Annotation' THEN
              flaggable_id NOT IN (SELECT id FROM annotations)
            WHEN 'Comment' THEN
              flaggable_id NOT IN (SELECT id FROM comments)
            ELSE
              TRUE
            END
          SQL
        end

        say_with_time "Pruning flags for unique creator constraint" do
          exec_delete(<<~SQL.strip_heredoc)
          WITH flags_to_keep AS (
            SELECT DISTINCT ON (creator_id, flaggable_type, flaggable_id)
              id
              FROM flags
              ORDER BY creator_id, flaggable_type, flaggable_id, created_at ASC
          )
          DELETE FROM flags
          WHERE id NOT IN (SELECT id FROM flags_to_keep)
          SQL
        end
      end
    end
  end

  # @return [void]
  def reset_flag_status!
    reversible do |dir|
      dir.up do
        say_with_time "Resetting Annotation flag counts" do
          exec_update(<<~SQL.strip_heredoc)
          WITH flag_counts AS (
            SELECT
              flaggable_type AS flaggable_type,
              flaggable_id AS flaggable_id,
              array_agg(DISTINCT creator_id) FILTER (WHERE NOT resolved_by_creator) AS flagger_ids,
              COUNT(DISTINCT id) AS flags_count,
              COUNT(DISTINCT id) FILTER (WHERE resolved_at IS NOT NULL) AS resolved_flags_count,
              COUNT(DISTINCT id) FILTER (WHERE resolved_at IS NULL) AS unresolved_flags_count
            FROM flags
            GROUP BY 1, 2
          ), full_flag_counts AS (
            SELECT
              fl.id AS flaggable_id,
              COALESCE(fc.flagger_ids, '{}'::uuid[]) AS flagger_ids,
              COALESCE(fc.flags_count, 0) AS flags_count,
              COALESCE(fc.resolved_flags_count, 0) AS resolved_flags_count,
              COALESCE(fc.unresolved_flags_count, 0) AS unresolved_flags_count
            FROM annotations fl
            LEFT OUTER JOIN flag_counts fc ON fc.flaggable_type = 'Annotation' AND fc.flaggable_id = fl.id
          )
          UPDATE annotations fl SET
            flagger_ids = fc.flagger_ids,
            flags_count = fc.flags_count,
            resolved_flags_count = fc.resolved_flags_count,
            unresolved_flags_count = fc.unresolved_flags_count
          FROM full_flag_counts fc
          WHERE fc.flaggable_id = fl.id
          SQL
        end

        say_with_time "Resetting Comment flag counts" do
          exec_update(<<~SQL.strip_heredoc)
          WITH flag_counts AS (
            SELECT
              flaggable_type AS flaggable_type,
              flaggable_id AS flaggable_id,
              array_agg(DISTINCT creator_id) AS flagger_ids,
              COUNT(DISTINCT id) AS flags_count,
              COUNT(DISTINCT id) FILTER (WHERE resolved_at IS NOT NULL) AS resolved_flags_count,
              COUNT(DISTINCT id) FILTER (WHERE resolved_at IS NULL) AS unresolved_flags_count
            FROM flags
            GROUP BY 1, 2
          ), full_flag_counts AS (
            SELECT
              fl.id AS flaggable_id,
              COALESCE(fc.flagger_ids, '{}'::uuid[]) AS flagger_ids,
              COALESCE(fc.flags_count, 0) AS flags_count,
              COALESCE(fc.resolved_flags_count, 0) AS resolved_flags_count,
              COALESCE(fc.unresolved_flags_count, 0) AS unresolved_flags_count
            FROM comments fl
            LEFT OUTER JOIN flag_counts fc ON fc.flaggable_type = 'Comment' AND fc.flaggable_id = fl.id
          )
          UPDATE comments fl SET
            flagger_ids = fc.flagger_ids,
            flags_count = fc.flags_count,
            resolved_flags_count = fc.resolved_flags_count,
            unresolved_flags_count = fc.unresolved_flags_count
          FROM full_flag_counts fc
          WHERE fc.flaggable_id = fl.id
          SQL
        end
      end
    end
  end
end
