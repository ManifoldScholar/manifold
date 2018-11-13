class AddMakerIndexOnNames < ActiveRecord::Migration[5.0]
  def up
    execute <<~SQL.strip_heredoc
      CREATE INDEX index_makers_sort_by_name ON makers ((COALESCE("last_name", '') || COALESCE("first_name", '')));
    SQL
  end

  def down
    execute <<~SQL.strip_heredoc
      DROP INDEX index_makers_sort_by_name
    SQL
  end
end
