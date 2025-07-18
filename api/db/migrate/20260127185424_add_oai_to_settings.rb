class AddOAIToSettings < ActiveRecord::Migration[7.0]
  def change
    add_column :settings, :oai, :jsonb, default: {}
  end
end
