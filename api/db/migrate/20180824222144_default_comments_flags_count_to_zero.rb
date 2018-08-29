class DefaultCommentsFlagsCountToZero < ActiveRecord::Migration[5.0]
  def up
    change_column :comments, :flags_count, :integer, default: 0

    execute <<-SQL.squish
      UPDATE comments
        SET flags_count = (SELECT count(1) FROM flags WHERE flags.flaggable_id = comments.id)
    SQL
  end

  def down
    change_column :comments, :flags_count, :integer
  end
end
