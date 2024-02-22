# frozen_string_literal: true

RSpec.describe SettingsService::ReadFromEnv, interaction: true do
  context "when reading from the special `:config` section" do
    let(:google_service) { Rails.root.join("spec", "data", "sample_config", "google_service.json").to_s }

    let(:expected_settings) do
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

    before do
      stub_env("MANIFOLD_SETTING_CONFIG_GOOGLE_SERVICE", google_service)

      # Unknown configs are silently ignored.
      stub_env("MANIFOLD_SETTING_CONFIG_SOME_UNKNOWN_SERVICE", "never/seen/path")
    end

    it "parses and reads the google config" do
      perform_within_expectation!

      expect(@outcome.result).to include_json(expected_settings)
    end
  end

  context "when reading standard environment overrides" do
    let(:smtp_settings_password) { "12356" }
    let(:unknown_value) { "some unknown value" }
    let(:other) { "never seen" }

    let(:expected_settings) do
      {
        invalid: {
          other: other,
        },
        secrets: {
          smtp_settings_password: smtp_settings_password,
          unknown_value: unknown_value,
        }
      }
    end

    before do
      stub_env("MANIFOLD_SETTING_SECRETS_SMTP_SETTINGS_PASSWORD", smtp_settings_password)
      stub_env("MANIFOLD_SETTING_SECRETS_UNKNOWN_VALUE", unknown_value)
      stub_env("MANIFOLD_SETTING_INVALID_OTHER", other)
    end

    it "pulls out the expected settings" do
      perform_within_expectation!

      expect(@outcome.result).to include_json(expected_settings)
    end
  end
end
