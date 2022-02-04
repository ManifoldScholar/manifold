class AddSlugFieldsToJournalModels < ActiveRecord::Migration[6.0]
  def change
    add_column :journal_issues, :slug, :text
    add_column :journal_volumes, :slug, :text
    add_index :journal_issues, :slug, unique: true
    add_index :journal_volumes, :slug, unique: true

    reversible do |change|

      change.up do
        %w(JournalIssue JournalVolume).each do |klass|
          klass.constantize.reset_column_information
          klass.constantize.find_each(&:save)
        end
      end

    end
  end

end
