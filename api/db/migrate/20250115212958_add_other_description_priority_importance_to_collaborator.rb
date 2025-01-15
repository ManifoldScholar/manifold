class AddOtherDescriptionPriorityImportanceToCollaborator < ActiveRecord::Migration[6.1]
  def change
    add_column :collaborators, :other_description, :string
    add_column :collaborators, :priority, :integer
    add_column :collaborators, :importance, :integer
  end
end
