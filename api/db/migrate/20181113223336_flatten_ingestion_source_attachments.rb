class FlattenIngestionSourceAttachments < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL.squish
          UPDATE ingestion_sources SET attachment_data = attachment_data -> 'original' WHERE attachment_data ? 'original'
        SQL
      end

      dir.down do
        execute <<~SQL.squish
          UPDATE ingestion_sources SET attachment_data = jsonb_build_object('original', attachment_data) WHERE NOT ( attachment_data ? 'original' )
        SQL
      end
    end
  end
end
