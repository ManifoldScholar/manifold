require 'rails_helper'

RSpec.describe FormattedAttributes::PurgeLegacyCachesJob, type: :job do
  it "runs without issue" do
    expect do
      described_class.perform_now
    end.to execute_safely
  end
end
