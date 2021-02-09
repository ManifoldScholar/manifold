class CreateUserCollectedModels < ActiveRecord::Migration[6.0]
  NAMES = %i[project resource resource_collection text]

  def change
    create_user_collected_table_for :project
    create_user_collected_table_for :resource
    create_user_collected_table_for :resource_collection
    create_user_collected_table_for :text

    create_table :user_collected_composite_entries, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_user_reference" }
      t.references :collectable, null: false, type: :uuid, polymorphic: true, index: { name: "index_ucce_collectable_reference" }
      t.references :project, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_inferred_project_reference" }

      t.references :user_collected_project, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_project_reference" }
      t.references :user_collected_resource, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_resource_reference" }
      t.references :user_collected_resource_collection, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_resource_collection_reference" }
      t.references :user_collected_text, null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_text_reference" }

      t.text :collectable_jsonapi_type, null: false

      t.timestamps

      t.index %i[user_id collectable_type collectable_id], unique: true, name: "index_ucce_uniqueness"
    end

    migrate_favorites_for :project
    migrate_favorites_for :resource
    migrate_favorites_for :resource_collection
    migrate_favorites_for :text
  end

  private

  def create_user_collected_table_for(name, collection: name.to_s.tableize.to_sym)
    table_name = :"user_collected_#{collection}"

    create_table table_name, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references name, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_uc_#{name}_reference" }

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %I[user_id #{name}_id], unique: true, name: "index_uc_#{name}_uniqueness"
    end
  end

  def migrate_favorites_for(name, collection: name.to_s.tableize.to_sym, type: name.to_s.classify)
    entry_foreign_key = connection.quote_column_name "user_collected_#{name}_id"

    model_foreign_key = connection.quote_column_name "#{name}_id"

    model_table = connection.quote_table_name collection

    entry_table = connection.quote_table_name "user_collected_#{collection}"

    polymorphic_type = connection.quote type

    collectable_jsonapi_type = connection.quote collection

    project_id_column = type == "Project" ? "collectable_id" : "pjoin.project_id"

    project_join = <<~SQL.strip_heredoc.squish unless type == "Project"
    INNER JOIN #{model_table} pjoin ON pjoin.id = collectable_id
    SQL

    reversible do |dir|
      dir.up do
        say_with_time "Migrating current favorites for #{type}" do
          execute(<<~SQL).cmdtuples
          WITH existing_favorites AS (
            SELECT
              user_id,
              favoritable_id AS #{model_foreign_key},
              MIN(created_at) AS created_at,
              MIN(updated_at) AS updated_at
              FROM favorites
              WHERE
                user_id IN (SELECT id FROM users)
                AND
                favoritable_type = #{polymorphic_type}
                AND
                favoritable_id IN (SELECT id FROM #{model_table})
              GROUP BY 1, 2
          ), converted_entries AS (
            INSERT INTO #{entry_table} (user_id, #{model_foreign_key}, created_at, updated_at)
            SELECT user_id, #{model_foreign_key}, created_at, updated_at FROM existing_favorites
            RETURNING
              user_id, #{model_foreign_key} AS collectable_id, id AS #{entry_foreign_key}, created_at, updated_at
          ) INSERT INTO user_collected_composite_entries (user_id, collectable_type, collectable_id, #{entry_foreign_key}, project_id, collectable_jsonapi_type, created_at, updated_at)
          SELECT ce.user_id, #{polymorphic_type} AS collectable_type, collectable_id, #{entry_foreign_key}, #{project_id_column}, #{collectable_jsonapi_type}, ce.created_at, ce.updated_at
          FROM converted_entries ce
          #{project_join} 
          SQL
        end
      end
    end
  end
end
