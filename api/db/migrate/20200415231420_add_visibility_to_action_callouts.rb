class AddVisibilityToActionCallouts < ActiveRecord::Migration[5.2]
  def change
    add_column :action_callouts, :visibility, :integer, default: 0, null: false
  end
end
