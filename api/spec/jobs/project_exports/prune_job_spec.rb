require 'rails_helper'

RSpec.describe ProjectExports::PruneJob, type: :job, packaging: true do
  it "calls the interaction" do
    expect(ProjectExports::Prune).to receive(:run!).once

    expect do
      described_class.perform_now
    end.to execute_safely
  end
end
