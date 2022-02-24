class MakeJournalIssuesCollectable < ActiveRecord::Migration[6.0]
  def change
    make_collectable :journal_issue
  end

  private

  def make_collectable(name, **options)
    make_collectable_for_reading_group name, **options

    make_collectable_for_user name, **options
  end

  def make_collectable_for_reading_group(name, collection: name.to_s.tableize.to_sym)
    table_name = :"reading_group_#{collection}"

    create_table table_name, id: :uuid do |t|
      t.references :reading_group, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references name, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rg_#{name}_reference" }
      t.references :reading_group_category, null: true, type: :uuid, foreign_key: { on_delete: :nullify }
      t.integer :position

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %I[reading_group_id #{name}_id], unique: true, name: "index_rg_#{collection}_uniqueness"
      t.index %i[reading_group_id reading_group_category_id position], name: "index_rg_#{collection}_ordering"
    end

    change_table :reading_group_composite_entries do |t|
      t.references :"reading_group_#{name}", null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_rgce_#{name}_reference" }
    end
  end

  def make_collectable_for_user(name, collection: name.to_s.tableize.to_sym)
    table_name = :"user_collected_#{collection}"

    create_table table_name, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: { on_delete: :cascade }
      t.references name, null: false, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_uc_#{name}_reference" }

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %I[user_id #{name}_id], unique: true, name: "index_uc_#{name}_uniqueness"
    end

    change_table :user_collected_composite_entries do |t|
      t.references :"user_collected_#{name}", null: true, type: :uuid, foreign_key: { on_delete: :cascade }, index: { name: "index_ucce_#{name}_reference" }
    end
  end
end

