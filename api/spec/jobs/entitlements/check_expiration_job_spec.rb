# frozen_string_literal: true

RSpec.describe Entitlements::CheckExpirationJob, type: :job do
  before do
    allow(Entitlements::CheckExpiration).to receive(:run!).and_return(nil)
  end

  it "calls the interaction" do
    expect do
      described_class.perform_now
    end.not_to raise_error

    expect(Entitlements::CheckExpiration).to have_received(:run!).once
  end
end
