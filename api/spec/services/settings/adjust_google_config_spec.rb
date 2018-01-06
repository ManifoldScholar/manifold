require 'rails_helper'

RSpec.describe Settings::AdjustGoogleConfig do
  let(:config_path) { "spec/data/sample_config/google_service.json" }
  let(:adjusted_config) {
    {
      integrations: {
        google_project_id: "manifold-test",
        google_private_key_id: "123abc",
        google_client_email: "manifold@manifold.app",
        google_client_id: "9000"
      },
      secrets: {
        google_private_key: "shhhhhhhh"
      }
    }

  }

  it 'correctly formats the config' do
    data = JSON.parse File.read(config_path)
    expect(Settings::AdjustGoogleConfig.run!(config: data)).to eq adjusted_config
  end

end
