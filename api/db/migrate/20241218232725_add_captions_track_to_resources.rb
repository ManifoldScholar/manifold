class AddCaptionsTrackToResources < ActiveRecord::Migration[6.1]
  def change
    add_column :resources, :captions_track_data, :jsonb, default: nil
  end
end
