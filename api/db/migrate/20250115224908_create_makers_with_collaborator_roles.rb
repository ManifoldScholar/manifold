class CreateMakersWithCollaboratorRoles < ActiveRecord::Migration[6.1]
  def change
    create_view :makers_with_collaborator_roles
  end
end
