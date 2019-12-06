require 'rails_helper'

RSpec.describe Texts::AutomateExportsJob, type: :job, packaging: true do
  it "calls the interaction" do
    expect(Texts::AutomateExports).to receive(:run!).once

    expect do
      described_class.perform_now
    end.to execute_safely
  end
end
