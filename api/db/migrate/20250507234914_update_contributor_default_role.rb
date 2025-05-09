class UpdateContributorDefaultRole < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL
      UPDATE public.collaborators
      SET role = 'contributor', priority = 12000
      WHERE role = 'other';
    SQL
  end
end
