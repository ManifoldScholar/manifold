class ChangeForewordRoleSpelling < ActiveRecord::Migration[7.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL
        UPDATE collaborators
        SET role = 'foreword'
        WHERE role = 'foreward'
        SQL
      end

      dir.down do
        execute <<~SQL
        UPDATE collaborators
        SET role = 'foreward'
        WHERE role = 'foreword'
        SQL
      end
    end
  end
end
