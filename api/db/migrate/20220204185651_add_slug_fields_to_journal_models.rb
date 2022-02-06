class AddSlugFieldsToJournalModels < ActiveRecord::Migration[6.0]
  def change
    add_column :journal_issues, :slug, :text
    add_column :journal_issues, :fa_cache, :jsonb, default: {}, null: false

    add_column :journal_volumes, :slug, :text

    add_column :journals, :logo_data, :jsonb
    add_column :journals, :hero_background_color, :string
    add_column :journals, :show_on_homepage, :boolean, default: false, null: false

    remove_column :journals, :cover_data, :jsonb

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
