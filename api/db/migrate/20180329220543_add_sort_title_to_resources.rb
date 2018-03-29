class AddSortTitleToResources < ActiveRecord::Migration[5.0]
  def change
    add_column :resources, :sort_title, :string

    reversible do |change|
      change.up do
        say_with_time 'updating sort_title for resources' do
          Resource.find_each(&:save)
        end
      end
    end
  end
end
