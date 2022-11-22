class AddGdprFieldsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :consent_manifold_analytics,  :boolean, null: true
    add_column :users, :consent_google_analytics,  :boolean, null: true
    add_column :users, :terms_and_conditions_accepted_at, :datetime, null: true
  end
end
