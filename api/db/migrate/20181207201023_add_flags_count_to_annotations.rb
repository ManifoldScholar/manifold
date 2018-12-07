class AddFlagsCountToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :flags_count, :integer, default: 0
  end
end
