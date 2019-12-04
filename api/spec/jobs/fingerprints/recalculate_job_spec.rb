require "rails_helper"

RSpec.describe Fingerprints::RecalculateJob, fingerprint_calculation: true, type: :job do
  let!(:text) { FactoryBot.create :text }

  it "wraps the recalculate interaction" do
    expect(Fingerprints::Recalculate).to receive(:run!).with(fingerprintable: text)

    expect do
      described_class.perform_now text
    end.not_to raise_error
  end
end
