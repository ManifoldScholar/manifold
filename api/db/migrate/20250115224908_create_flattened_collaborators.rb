class CreateFlattenedCollaborators < ActiveRecord::Migration[6.1]
  def change
    create_view :flattened_collaborators
  end
end
