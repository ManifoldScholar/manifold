class CreateUserDerivedRoles < ActiveRecord::Migration[5.2]
  def change
    create_view :user_derived_roles
  end
end
