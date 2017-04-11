class AddIntegrationsAndSecretsToSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :settings, :integrations, :jsonb, default: {}
    add_column :settings, :secrets, :jsonb, default: {}
    remove_column :settings, :oauth, :jsonb, default: {}
  end
end
