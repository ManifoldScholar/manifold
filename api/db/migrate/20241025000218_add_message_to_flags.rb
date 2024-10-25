class AddMessageToFlags < ActiveRecord::Migration[6.1]
  def change
    add_column :flags, :message, :text, null: true
  end
end
