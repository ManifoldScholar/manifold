# frozen_string_literal: true

RSpec.describe SettingsService::UpdateFromEnv, interaction: true do
  let_it_be(:settings_instance, refind: true) { Settings.instance }

  let_input!(:settings) { settings_instance }

  let(:smtp_settings_password) { "12356" }
  let(:unknown_value) { "some unknown value" }

  before do
    stub_env("MANIFOLD_SETTING_SECRETS_SMTP_SETTINGS_PASSWORD", smtp_settings_password)
    # Unknown values will be handled automatically and stored quietly.
    stub_env("MANIFOLD_SETTING_SECRETS_UNKNOWN_VALUE", unknown_value)
    # The following will be silently ignored.
    stub_env("MANIFOLD_SETTING_INVALID_OTHER", "never seen")
  end

  it "merges in new settings from the environment" do
    perform_within_expectation! do |e|
      e.to change { settings.reload.secrets.smtp_settings_password }.to(smtp_settings_password)
        .and change { settings.reload.secrets.unknown_attributes["unknown_value"] }.from(nil).to(unknown_value)
    end
  end
end
