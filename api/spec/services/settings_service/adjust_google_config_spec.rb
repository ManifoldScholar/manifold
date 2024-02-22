# frozen_string_literal: true

RSpec.describe SettingsService::AdjustGoogleConfig, interaction: true do
  let(:config_path) { "spec/data/sample_config/google_service.json" }

  let(:expected_config) do
    {
      integrations: {
        google_project_id: "manifold-test",
        google_private_key_id: "123abc",
        google_client_email: "manifold@manifold.app",
        google_client_id: "9000"
      },
      secrets: {
        google_private_key: "shhhhhhhh",
      },
    }
  end

  let_input!(:config) { JSON.parse Rails.root.join(config_path).read }

  it "correctly formats the config" do
    perform_within_expectation!

    expect(@outcome.result).to eq expected_config
  end
end
