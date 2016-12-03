class AddCollaboratableToCollaborators < ActiveRecord::Migration[5.0]
  def up
    add_column :collaborators, :collaboratable_type, :string
    add_column :collaborators, :collaboratable_id, :uuid

    Collaborator
      .where("collaborators.project_id IS NOT NULL")
      .update_all("collaboratable_id = project_id, collaboratable_type = 'Project'")

    Collaborator
      .where("collaborators.text_id IS NOT NULL")
      .update_all("collaboratable_id = text_id, collaboratable_type = 'Text'")

    remove_column :collaborators, :project_id
    remove_column :collaborators, :text_id

  end

  def down
    add_column :collaborators, :project_id, :uuid
    add_column :collaborators, :text_id, :uuid

    Collaborator
      .where("collaborators.collaboratable_type = 'Project'")
      .update_all("project_id = collaboratable_id")

    Collaborator
      .where("collaborators.collaboratable_type = 'Text'")
      .update_all("text_id = collaboratable_id")

    remove_column :collaborators, :collaboratable_type
    remove_column :collaborators, :collaboratable_id

  end
end
