class AddIncludeSignUpToFeatures < ActiveRecord::Migration[5.0]
  def change
    add_column :features, :include_sign_up, :boolean, default: false, null: false
  end
end
