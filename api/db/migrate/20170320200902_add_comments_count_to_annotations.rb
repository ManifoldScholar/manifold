class AddCommentsCountToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :comments_count, :integer, default: 0
  end
end
