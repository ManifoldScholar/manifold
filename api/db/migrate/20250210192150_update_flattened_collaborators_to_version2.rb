class UpdateFlattenedCollaboratorsToVersion2 < ActiveRecord::Migration[6.1]
  def change
    update_view :flattened_collaborators, version: 2, revert_to_version: 1
  end
end
