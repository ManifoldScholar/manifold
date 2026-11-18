# frozen_string_literal: true

require "dynamic_mailer/configuration"
require "rails_helper"

RSpec.describe DynamicMailer::Configuration do
  let(:smtp_settings) do
    Settings.new(
      secrets: {
        smtp_settings_password: "password"
      },
      email: {
        delivery_method: "smtp",
        smtp_settings_address: "server.com",
        smtp_settings_port: 568,
        smtp_settings_user_name: "user"
      }
    )
  end
  let(:smtp_instance) { described_class.new(smtp_settings) }

  it "uses smtp when the settings delivery_method is 'smtp'" do
    expect(smtp_instance.use_smtp?).to be true
  end

  it "reports smtp as configured when an address is present" do
    expect(smtp_instance.smtp_configured?).to be true
  end

  it "reports smtp as unconfigured when the address is blank" do
    instance = described_class.new(Settings.new(email: { delivery_method: "smtp" }))

    expect(instance.smtp_configured?).to be false
  end

  it "correctly reports smtp settings" do
    expect(smtp_instance.smtp_config).to eq(
      address: "server.com",
      port: 568,
      domain: "localhost.localdomain",
      user_name: "user",
      password: "password",
      authentication: nil,
      enable_starttls: nil,
      enable_starttls_auto: true,
      openssl_verify_mode: nil,
      ssl: nil,
      tls: nil,
      open_timeout: nil,
      read_timeout: nil
    )
  end
end
