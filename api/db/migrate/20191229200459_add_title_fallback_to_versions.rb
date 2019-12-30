class AddTitleFallbackToVersions < ActiveRecord::Migration[5.2]
  def change
    add_column :versions, :title_fallback, :string
  end
end
