class CreateUserEntitlements < ActiveRecord::Migration[5.2]
  def change
    create_view :user_entitlements
  end
end
