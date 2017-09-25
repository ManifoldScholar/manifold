class AddSortTitleToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :sort_title, :string

    reversible do |change|
      change.up do
        say_with_time 'updating sort_field for projects' do
          update "UPDATE projects SET sort_title = regexp_replace(title, '^(a|the) ', '', 'i')"
        end
      end
    end
  end
end
