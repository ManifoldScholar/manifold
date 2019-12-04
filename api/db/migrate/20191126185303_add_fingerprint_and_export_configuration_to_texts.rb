class AddFingerprintAndExportConfigurationToTexts < ActiveRecord::Migration[5.2]
  def change
    change_table :texts do |t|
      t.text :fingerprint, null: true
      t.jsonb :export_configuration, null: false, default: {}

      t.index :fingerprint
      t.index %[(export_configuration @> '{"epub_v3": true}'::jsonb)], name: "index_texts_export_configuration_exports_as_epub_v3"
    end

    reversible do |dir|
      dir.up do
        say_with_time "Setting initial text fingerprints to a dummy value" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          UPDATE texts SET fingerprint = '1234567890' WHERE fingerprint IS NULL
          SQL
        end

        say_with_time "Asynchronously recalculating text fingerprints after a delay" do
          counter = 0

          Text.find_each do |text|
            begin
              Fingerprints::RecalculateJob.set(wait: 5.minutes).perform_later(text)

              counter += 1
            rescue NameError
              # pass, future migration might not have this job anymore
            rescue StandardError => e
              say "Could not enqueue recalculate job for Text##{text.id}: #{e.inspect}", true
            end
          end

          counter
        end
      end
    end

    change_column_null :texts, :fingerprint, false
  end
end
