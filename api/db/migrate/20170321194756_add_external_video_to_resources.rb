class AddExternalVideoToResources < ActiveRecord::Migration[5.0]
  def change
    add_column :resources, :is_external_video, :boolean, default: false
  end
end
