class AddHomepageStartAndEndDatesToProjectCollections < ActiveRecord::Migration[5.0]
  def change
    add_column :project_collections, :homepage_start_date, :date
    add_column :project_collections, :homepage_end_date, :date
  end
end
