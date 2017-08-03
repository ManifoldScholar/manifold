class AdjustEventUrls < ActiveRecord::Migration[5.0]
  def up
    Event.update_all("event_url = replace(event_url, '/browse/project', '/project')")
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
