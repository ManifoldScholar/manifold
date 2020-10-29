class ConvertBodyJSON < ActiveRecord::Migration[5.0]
  def change
    rename_column :text_sections, :body_json, :body_json_text

    add_column :text_sections, :body_json, :jsonb, null: false, default: '{}'

    reversible do |dir|
      dir.up do
        say_with_time 'Converting current json bodies' do
          execute <<-SQL
            UPDATE text_sections SET body_json = COALESCE(body_json_text, '{}')::jsonb;
          SQL
        end
      end

      dir.down do
        say_with_time 'Reverting to json text' do
          execute <<-SQL
            UPDATE text_sections SET body_json_text = body_json::text;
          SQL
        end
      end
    end

    remove_column :text_sections, :body_json_text, :text
  end
end
