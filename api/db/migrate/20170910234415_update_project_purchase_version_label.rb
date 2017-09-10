class UpdateProjectPurchaseVersionLabel < ActiveRecord::Migration[5.0]
  def change
    rename_column :projects, :purchase_version_label, :purchase_call_to_action
  end
end
