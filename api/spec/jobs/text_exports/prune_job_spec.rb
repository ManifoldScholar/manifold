# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TextExports::PruneJob, type: :job, packaging: true do
  it "calls the interaction" do
    expect(TextExports::Prune).to receive(:run!).once # rubocop:todo RSpec/MessageSpies

    expect do
      described_class.perform_now
    end.to execute_safely
  end
end
