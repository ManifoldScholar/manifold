class CreateCommentHierarchies < ActiveRecord::Migration[5.0]
  def change
    create_table :comment_hierarchies, id: false do |t|
      t.uuid :ancestor_id, null: false
      t.uuid :descendant_id, null: false
      t.integer :generations, null: false
    end

    add_index :comment_hierarchies, [:ancestor_id, :descendant_id, :generations],
      unique: true,
      name: "comment_anc_desc_idx"

    add_index :comment_hierarchies, [:descendant_id],
      name: "comment_desc_idx"

    add_column :comments, :sort_order, :integer

    say_with_time 'building existing comments tree' do
      Comment.rebuild!
    end
  end
end
