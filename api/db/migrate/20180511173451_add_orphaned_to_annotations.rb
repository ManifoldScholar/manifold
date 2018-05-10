class AddOrphanedToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :orphaned, :boolean, default: false, null: false
  end
end
