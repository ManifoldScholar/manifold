# frozen_string_literal: true

class AddExpiresOnToUserGroupEntitleables < ActiveRecord::Migration[7.0]
  def change
    add_column :user_group_entitleables, :expires_on, :date
  end
end
