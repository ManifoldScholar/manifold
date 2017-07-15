require "dynamic_mailer/configuration"
require "rails_helper"

RSpec.describe DynamicMailer::Configuration do

  let(:smtp_settings) {
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
  }
  let(:sendmail_settings) {
    Settings.new(
      email: {
        delivery_method: "sendmail",
        sendmail_settings_location: "/foo/bar",
        sendmail_settings_arguments: "-glorp"
      }
    )
  }

  let(:smtp_instance) { described_class.new(smtp_settings) }
  let(:sendmail_instance) { described_class.new(sendmail_settings) }

  it "uses smtp when the settings delivery_method is 'smtp'" do
    expect(smtp_instance.use_smtp?).to be true
  end

  it "uses sendmail when the settings delivery_method is 'sendmail'" do
    expect(sendmail_instance.use_sendmail?).to be true
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

  it "correctly reports sendmail settings" do
    expect(sendmail_instance.sendmail_config).to eq(
      location: "/foo/bar",
      arguments: "-glorp"
    )
  end

  it "correctly reports default sendmail settings" do
    expect(smtp_instance.sendmail_config).to eq(
      location: "/usr/sbin/sendmail",
      arguments: "-i"
     )
  end

end
