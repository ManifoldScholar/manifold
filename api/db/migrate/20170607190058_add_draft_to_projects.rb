class AddDraftToProjects < ActiveRecord::Migration[5.0]
  def up
    add_column :projects, :draft, :boolean, null: false, default: true

    Project.reset_column_information

    say_with_time 'Setting draft to FALSE for existing projects' do
      Project.find_each do |project|
        project.draft = false
        project.save
      end
    end
  end

  def down
    remove_column :projects, :draft, :boolean
  end
end
