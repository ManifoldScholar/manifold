class AddOtherDescriptionPriorityImportanceToCollaborator < ActiveRecord::Migration[6.1]
  def change
    add_column :collaborators, :other_description, :string
    add_column :collaborators, :priority, :integer
    add_column :collaborators, :importance, :integer
    change_table :collaborators do |t|
      t.index %i[collaboratable_id collaboratable_type priority role importance], name: "index_collaborators_sort_order"
    end
  end
end
