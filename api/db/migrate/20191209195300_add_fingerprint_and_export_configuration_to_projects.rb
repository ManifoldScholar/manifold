class AddFingerprintAndExportConfigurationToProjects < ActiveRecord::Migration[5.2]
  def change
    change_table :projects do |t|
      t.text :fingerprint, null: true
      t.jsonb :export_configuration, null: false, default: {}

      t.index :fingerprint
      t.index %[(export_configuration @> '{"bag_it": true}'::jsonb)], name: "index_projects_export_configuration_exports_as_bag_it"
    end

    reversible do |dir|
      dir.up do
        say_with_time "Setting initial project fingerprints to a dummy value" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          UPDATE projects SET fingerprint = '1234567890' WHERE fingerprint IS NULL
          SQL
        end

        say_with_time "Asynchronously recalculating text fingerprints after a delay" do
          counter = 0

          Project.find_each do |project|
            begin
              Fingerprints::RecalculateJob.set(wait: 5.minutes).perform_later(project)

              counter += 1
            rescue NameError
              # pass, future migration might not have this job anymore
            rescue StandardError => e
              say "Could not enqueue recalculate job for Project##{project.id}: #{e.inspect}", true
            end
          end

          counter
        end
      end
    end

    change_column_null :projects, :fingerprint, false
  end
end
