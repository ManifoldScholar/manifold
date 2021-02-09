class CreateUserCollections < ActiveRecord::Migration[6.0]
  def change
    create_view :user_collections
  end
end
