class CreateEntitlementRoles < ActiveRecord::Migration[5.2]
  def change
    create_table :entitlement_roles, id: :uuid do |t|
      t.text :name, null: false
      t.text :kind, null: false, default: "unknown"

      t.timestamps

      t.index :name, unique: true
      t.index :kind
    end

    reversible do |dir|
      dir.up do
        say_with_time "Inserting initial entitlement roles" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          INSERT INTO entitlement_roles (name, kind, created_at, updated_at)
          VALUES
          ('subscriber', 'global_entitlement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('read_access', 'scoped_entitlement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ;
          SQL
        end
      end
    end
  end
end
