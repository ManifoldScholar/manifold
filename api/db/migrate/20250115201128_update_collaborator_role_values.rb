class UpdateCollaboratorRoleValues < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL
      UPDATE public.collaborators
      SET role = "author"
      WHERE role = "creator";
    SQL
    execute <<~SQL
      UPDATE public.collaborators
      SET role = "other"
      WHERE role = "contributor";
    SQL
  end
end
