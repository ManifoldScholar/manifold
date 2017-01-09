class AdjustProjectPublicationDate < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :publication_date, :date
    remove_column :projects, :publication_year, :integer
    remove_column  :projects, :publication_month, :integer
    remove_column  :projects, :publication_day_of_month, :integer
  end
end
