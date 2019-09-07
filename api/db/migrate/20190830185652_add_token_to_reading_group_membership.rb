class AddTokenToReadingGroupMembership < ActiveRecord::Migration[5.2]
  def change
    add_column :reading_group_memberships, :anonymous_label, :string
    add_index :reading_group_memberships, [:reading_group_id, :anonymous_label], unique: true, name: "anonymous_label_index"
  end
end
