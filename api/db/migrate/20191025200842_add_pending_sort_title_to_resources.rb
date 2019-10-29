class AddPendingSortTitleToResources < ActiveRecord::Migration[5.2]
  def change
    enable_extension "citext"

    add_column :resources, :pending_sort_title, :string

    reversible do |change|
      change.up do
        change_column :resources, :sort_title, :citext
        change_column :projects, :sort_title, :citext
      end

      change.down do
        change_column :resources, :sort_title, :string
        change_column :projects, :sort_title, :string
      end
    end
  end
end
