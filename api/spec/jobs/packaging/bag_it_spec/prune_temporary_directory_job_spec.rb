require 'rails_helper'

RSpec.describe Packaging::BagItSpec::PruneTemporaryDirectoryJob, type: :job do
  it "calls the interaction" do
    expect(Packaging::BagItSpec::PruneTemporaryDirectory).to receive(:run!).once

    expect do
      described_class.perform_now
    end.to execute_safely
  end
end
