class RestrictTextSectionBodyJSON < ActiveRecord::Migration[6.0]
  def change
    say_with_time "Correct text section body default" do
      execute <<~SQL
      ALTER TABLE text_sections
        ALTER COLUMN body_json SET DEFAULT '{}'::jsonb;
      SQL
    end

    reversible do |dir|
      dir.up do
        say_with_time "Correcting text section body JSONs." do
          exec_update(<<~SQL)
          UPDATE text_sections SET body_json = DEFAULT WHERE jsonb_typeof(body_json) = 'string'
          SQL
        end

        say_with_time "Adding a check constraint to guard our field" do
          execute <<~SQL
          ALTER TABLE text_sections
            ADD CONSTRAINT text_sections_body_json_must_be_object
            CHECK (
              jsonb_typeof(body_json) = 'object'
            );
          SQL
        end
      end

      dir.down do
        say_with_time "Removing text section body JSON constraint" do
          execute <<~SQL
          ALTER TABLE text_sections
            DROP CONSTRAINT text_sections_body_json_must_be_object;
          SQL
        end
      end
    end
  end
end
