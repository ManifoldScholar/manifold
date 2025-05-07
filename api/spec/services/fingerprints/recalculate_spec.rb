# frozen_string_literal: true

require "rails_helper"

RSpec.describe Fingerprints::Recalculate, fingerprint_calculation: true, interaction: true do
  let_input!(:fingerprintable) { FactoryBot.create :text }

  it "recalculates the fingerprint" do
    expect(fingerprintable).to receive(:recalculate_fingerprint!).once.and_call_original # rubocop:todo RSpec/MessageSpies

    perform_within_expectation!
  end
end
