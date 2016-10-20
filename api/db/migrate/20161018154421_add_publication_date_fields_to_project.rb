class AddPublicationDateFieldsToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :publication_year, :integer
    add_column :projects, :publication_month, :integer
    add_column :projects, :publication_day_of_month, :integer
    remove_column :projects, :published_datetime, :datetime
  end
end
