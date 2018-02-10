class CreatePermissions < ActiveRecord::Migration[5.0]
  def change
    create_view :permissions
  end
end
