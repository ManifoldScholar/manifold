class CreateSystemEntitlements < ActiveRecord::Migration[5.2]
  def change
    create_table :system_entitlements, id: :uuid do |t|
      t.text :kind, null: false

      t.timestamps

      t.index :kind, unique: true
    end

    reversible do |dir|
      dir.up do
        say_with_time "Inserting initial system entitlements" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          INSERT INTO system_entitlements (kind, created_at, updated_at)
          VALUES
          ('subscription', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ;
          SQL
        end
      end
    end
  end
end
