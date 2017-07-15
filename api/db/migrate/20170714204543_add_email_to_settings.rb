class AddEmailToSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :settings, :email, :jsonb, default: {}
  end
end
