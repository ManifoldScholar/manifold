class AddAvatarMetaToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :avatar_meta, :jsonb, null: false, default: {}

    Project.reset_column_information

    say_with_time "Populating avatar_meta for projects" do
      Project.where("avatar_meta = '{}'").find_each do |project|
        project.avatar.reprocess!
      end
    end
  end
end
