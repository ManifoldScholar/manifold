class AddKindToRoles < ActiveRecord::Migration[5.2]
  def change
    change_table :roles do |t|
      t.text :kind, null: false, default: :unknown

      t.index :kind
    end

    reversible do |dir|
      dir.up do
        say_with_time "Updating role kinds" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          UPDATE roles SET kind = CASE "roles"."name"
          WHEN 'admin' THEN 'global'
          WHEN 'editor' THEN 'global'
          WHEN 'project_creator' THEN 'global'
          WHEN 'marketeer' THEN 'global'
          WHEN 'project_editor' THEN 'scoped'
          WHEN 'project_resource_editor' THEN 'scoped'
          WHEN 'project_author' THEN 'scoped'
          WHEN 'reader' THEN 'global'
          WHEN 'subscriber' THEN 'global_entitlement'
          WHEN 'read_access' THEN 'scoped_entitlement'
          ELSE 'unknown'
          END
          SQL
        end
      end
    end
  end
end
