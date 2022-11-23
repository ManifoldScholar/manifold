class CorrectTextSectionPositions < ActiveRecord::Migration[6.0]
  def change
    rename_column :text_sections, :position, :legacy_position

    change_table :text_sections do |t|
      t.bigint :position

      t.index %i[text_id position]
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating new positions from legacy positions" do
          exec_update <<~SQL
          WITH reordered_text_sections AS (
            SELECT id, dense_rank() OVER w AS new_position
            FROM text_sections
            WINDOW w AS (
              PARTITION BY text_id
              ORDER BY legacy_position ASC NULLS LAST, created_at ASC
            )
          ) UPDATE text_sections ts SET position = rts.new_position
            FROM reordered_text_sections rts WHERE rts.id = ts.id;
          SQL
        end
      end
    end
  end
end
