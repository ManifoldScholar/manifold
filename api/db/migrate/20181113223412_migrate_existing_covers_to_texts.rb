class MigrateExistingCoversToTexts < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        say_with_time "Migrating Cover IngestionSources to Texts" do
          IngestionSource.where(kind: IngestionSource::KIND_COVER_IMAGE).each do |cover|
            text = cover.text
            text&.update(cover: cover.attachment.open)
          end
        end
      end
    end
  end
end
