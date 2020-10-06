class DuplicateAllProjects < ActiveInteraction::Base
  integer :count, default: 5

  def execute
    Project.tagged_with("dupe", exclude: true).find_each do |project|
      count.times do
        compose DuplicateProject, project: project
      end
    end
  end
end
