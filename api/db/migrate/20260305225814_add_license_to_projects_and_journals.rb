class AddLicenseToProjectsAndJournals < ActiveRecord::Migration[7.0]
  def change
    add_column :journals, :license, :string
    add_column :projects, :license, :string
  end
end
