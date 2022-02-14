class InvertProjectJournalIssueRelationship < ActiveRecord::Migration[6.0]

  def change
    add_column :projects, :journal_issue_id, :uuid, foreign_key: true, null: true
    add_index :projects, :journal_issue_id, unique: true

    reversible do |change|
      change.up do
        update <<~SQL
        UPDATE projects AS p SET journal_issue_id = i.id FROM journal_issues AS i WHERE p.id = i.project_id
        SQL
      end

      change.down do
        update <<~SQL
        UPDATE journal_issues AS i SET project_id = p.id FROM projects AS p WHERE i.id = p.journal_issue_id
        SQL
      end
    end

    remove_index :journal_issues, column: :project_id, unique: true
    remove_column :journal_issues, :project_id, :uuid, foreign_key: true, null: false
  end

end
