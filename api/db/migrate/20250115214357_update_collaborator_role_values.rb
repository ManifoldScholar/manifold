class UpdateCollaboratorRoleValues < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL
      UPDATE public.collaborators
      SET role = 'author', priority = 0
      WHERE role = 'creator';
    SQL
    execute <<~SQL
      UPDATE public.collaborators
      SET role = 'other', other_description = 'contributor', priority = 20
      WHERE role = 'contributor';
    SQL
  end
end
