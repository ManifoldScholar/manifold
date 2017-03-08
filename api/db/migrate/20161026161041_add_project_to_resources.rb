class AddProjectToResources < ActiveRecord::Migration[5.0]
  def change
    add_reference :resources, :project, index: true
  end
end
