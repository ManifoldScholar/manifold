class AddOAIToSettings < ActiveRecord::Migration[7.0]
  def change
    add_column :settings, :oai, :jsonb, default: {
      repository_name: "Manifold",
      admin_email: "admin@manifold.app",
      directory_enabled: true
    }
  end
end
