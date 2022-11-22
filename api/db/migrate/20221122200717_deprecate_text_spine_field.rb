class DeprecateTextSpineField < ActiveRecord::Migration[6.0]
  def change
    rename_column :texts, :spine, :legacy_spine
  end
end
