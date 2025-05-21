class RemoveOriginalCaptionsTrack < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL
    ALTER TABLE resources DROP COLUMN IF EXISTS captions_track_data;
    SQL
  end

  def down
    # Intentionally left blank
  end
end
