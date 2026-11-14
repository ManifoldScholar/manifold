# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Registration::Consent do
  let(:request) { instance_double(ActionDispatch::Request, referrer: "https://canvas.example.com/") }
  let(:params) do
    { registration_token: "tok", openid_configuration: "https://canvas.example.com/.well-known/openid-configuration" }
  end

  subject(:consent) { described_class.new(request, params) }

  context "when LTI and autoregistration are enabled" do
    before { enable_lti_autoregistration! }

    it "is valid" do
      expect(consent).to be_valid
    end
  end

  context "when autoregistration is disabled" do
    before { Settings.instance.update!(lti: { enabled: true, autoregistration: false }) }

    it "is invalid" do
      expect(consent).to be_invalid
      expect(consent.errors).to include(a_string_matching(/disabled/))
    end
  end

  context "when LTI is disabled" do
    before { Settings.instance.update!(lti: { enabled: false, autoregistration: true }) }

    it "is invalid" do
      expect(consent).to be_invalid
    end
  end

  context "when a blocked registration exists for the referrer host" do
    before do
      enable_lti_autoregistration!
      FactoryBot.create(:lti_registration, :blocked, issuer: "https://canvas.example.com")
    end

    it "is invalid" do
      expect(consent).to be_invalid
      expect(consent.errors).to include(a_string_matching(/not permitted/))
    end
  end

  context "when the request has no usable referrer" do
    before { enable_lti_autoregistration! }

    it "is invalid when the referrer is missing" do
      allow(request).to receive(:referrer).and_return(nil)

      expect(consent).to be_invalid
      expect(consent.errors).to include(a_string_matching(/referer header/))
    end

    it "is invalid when the referrer is malformed" do
      allow(request).to receive(:referrer).and_return("https://exa mple.com")

      expect(consent).to be_invalid
      expect(consent.errors).to include(a_string_matching(/referer header/))
    end
  end
end
