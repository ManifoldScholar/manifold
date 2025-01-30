# frozen_string_literal: true

class AdjustProjectRoles < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        say_with_time "Migrating existing role names" do
          exec_update(<<~SQL.strip_heredoc)
          UPDATE roles SET name = 'project_property_manager' WHERE name = 'project_resource_editor';
          SQL
        end

        say_with_time "Migrating user kinds" do
          exec_update(<<~SQL.strip_heredoc)
          UPDATE users SET kind = 'project_property_manager' WHERE kind = 'project_resource_editor';
          SQL
        end
      end

      dir.down do
        say_with_time "Reverting existing role names" do
          exec_update(<<~SQL.strip_heredoc)
          UPDATE roles SET name = 'project_resource_editor' WHERE name = 'project_property_manager';
          SQL
        end

        say_with_time "Reverting user kinds" do
          exec_update(<<~SQL.strip_heredoc)
          UPDATE users SET kind = 'project_resource_editor' WHERE kind = 'project_property_manager';
          SQL
        end
      end
    end

    update_view :user_derived_roles, version: 2, revert_to_version: 1
  end
end
