require 'rails_helper'

RSpec.describe ExportTargetStrategy do
  let(:instance) { described_class.new }

  describe ExportTargetStrategy::S3, enum: true do
    it { is_expected.to be_disabled }
  end

  describe ExportTargetStrategy::SFTPKey, enum: true do
    it { is_expected.to be_enabled }
  end

  describe ExportTargetStrategy::SFTPPassword, enum: true do
    it { is_expected.to be_enabled }
  end

  describe ExportTargetStrategy::Unknown, enum: true do
    it { is_expected.to be_unknown }
  end

  describe ".enabled" do
    it "can yield enabled enums" do
      expect do |b|
        described_class.enabled(&b)
      end.to yield_successive_args(described_class[:sftp_key], described_class[:sftp_password])
    end
  end
end
