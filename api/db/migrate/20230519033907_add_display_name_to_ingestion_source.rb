class AddDisplayNameToIngestionSource < ActiveRecord::Migration[6.0]
  def change
    add_column :ingestion_sources, :display_name, :text, null: true
    
    reversible do |dir|
      dir.up do
        say_with_time 'Sourcing display_name from source_identifier' do
          execute <<~SQL
            UPDATE ingestion_sources SET display_name = source_identifier
          SQL
        end
      end
    end
  end
end
