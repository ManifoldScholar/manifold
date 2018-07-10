class RenameSettingsDefaultPlaceOfPublication < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL.strip_heredoc
          UPDATE settings
          SET general = general - 'default_place_of_publication' || jsonb_build_object('default_publisher_place', general ->> 'default_place_of_publication')
          WHERE general ? 'default_place_of_publication'
        SQL
      end

      dir.down do
        execute <<~SQL.strip_heredoc
          UPDATE settings
          UPDATE settings
          SET general = general - 'default_publisher_place' || jsonb_build_object('default_place_of_publication', general ->> 'default_publisher_place')
          WHERE general ? 'default_publisher_place'
        SQL
      end
    end
  end
end
