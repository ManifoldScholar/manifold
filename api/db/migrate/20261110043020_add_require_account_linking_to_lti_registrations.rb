class AddRequireAccountLinkingToLtiRegistrations < ActiveRecord::Migration[7.2]
  def change
    add_column :lti_registrations, :require_account_linking, :boolean, null: false, default: true
  end
end
