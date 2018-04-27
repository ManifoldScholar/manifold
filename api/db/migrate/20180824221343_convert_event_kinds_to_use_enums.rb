class ConvertEventKindsToUseEnums < ActiveRecord::Migration[5.0]
  def up
    say_with_time "Converting to classy_enum" do
      execute <<~SQL.strip_heredoc.strip
			UPDATE events SET event_type = LOWER(event_type)
      SQL
    end
  end

  def down
    say_with_time "Converting from classy_enum" do
      execute <<~SQL.strip_heredoc.strip
			UPDATE events SET event_type = UPPER(event_type)
      SQL
    end
  end
end
