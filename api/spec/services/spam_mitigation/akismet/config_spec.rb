# frozen_string_literal: true

RSpec.describe SpamMitigation::Akismet::Config do
  let(:instance) { described_class.new }

  subject { instance }

  context "when akismet is enabled" do
    before do
      akismet_enabled!
    end

    it { is_expected.to be_enabled }
  end

  context "when akismet is disabled" do
    before do
      akismet_disabled!
    end

    it { is_expected.not_to be_enabled }
  end
end
