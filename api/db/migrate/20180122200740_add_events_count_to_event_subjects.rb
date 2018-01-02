class AddEventsCountToEventSubjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :events_count, :integer, default: 0
    add_column :texts, :events_count, :integer, default: 0
    add_column :resources, :events_count, :integer, default: 0
    add_column :annotations, :events_count, :integer, default: 0

    reversible do |dir|
      dir.up do
        %w(project text resource annotation).each do |table|
          say_with_time "Setting events_count on #{table}" do
            generate_events_counts(table)
          end
        end
      end
    end
  end

  def generate_events_counts(table)
    subject = table == "project" ? table : "subject"
    execute <<-SQL.squish
      UPDATE #{table}s
        SET events_count = (SELECT count(1) FROM events WHERE events.#{subject}_id = #{table}s.id)
    SQL
  end
end
