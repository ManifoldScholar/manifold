# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::IssuerPolicy do
  def settings_for(allowlist: [], blocklist: [])
    SettingSections::Lti.new(issuer_allowlist: allowlist, issuer_blocklist: blocklist)
  end

  describe "#permits?" do
    context "with empty lists" do
      it "permits any issuer" do
        expect(described_class.new(settings_for).permits?("https://canvas.example.com")).to be true
      end

      it "rejects a blank issuer" do
        expect(described_class.new(settings_for).permits?(nil)).to be false
      end
    end

    context "with an allowlist" do
      subject(:policy) { described_class.new(settings_for(allowlist: ["evil.example.com"])) }

      it "permits an allowlisted host regardless of scheme or trailing slash" do
        expect(policy.permits?("https://evil.example.com/")).to be true
      end

      it "rejects a host that is not allowlisted" do
        expect(policy.permits?("https://other.example.com")).to be false
      end
    end

    context "with a blocklist" do
      subject(:policy) { described_class.new(settings_for(blocklist: ["https://evil.example.com"])) }

      it "rejects a blocklisted host even when the allowlist is empty" do
        expect(policy.permits?("https://evil.example.com")).to be false
      end
    end

    context "when a host appears on both lists" do
      subject(:policy) do
        described_class.new(settings_for(allowlist: ["evil.example.com"], blocklist: ["evil.example.com"]))
      end

      it "lets the blocklist win" do
        expect(policy.permits?("https://evil.example.com")).to be false
      end
    end
  end

  describe ".normalize_host" do
    it "extracts and downcases the host from a URL" do
      expect(described_class.normalize_host("HTTPS://Canvas.Example.com/lti")).to eq "canvas.example.com"
    end

    it "strips a www. prefix" do
      expect(described_class.normalize_host("https://www.example.com")).to eq "example.com"
    end

    it "treats a bare hostname as the host" do
      expect(described_class.normalize_host("example.com")).to eq "example.com"
    end

    it "returns nil for blank input" do
      expect(described_class.normalize_host("")).to be_nil
    end
  end
end
