class CreateReadingGroupKinds < ActiveRecord::Migration[6.0]
  def change
    create_table :reading_group_kinds, id: :uuid do |t|
      t.text :name, null: false
      t.text :slug, null: false

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end

    change_table :reading_groups do |t|
      t.references :reading_group_kind, null: true, type: :uuid, foreign_key: { on_delete: :nullify }
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating default reading group kinds" do
          execute(<<~SQL.strip_heredoc).cmdtuples
          INSERT INTO reading_group_kinds (name, slug)
          VALUES
            ('Course', 'course'),
            ('Study Group', 'study-group')
          ;
          SQL
        end
      end
    end
  end
end
