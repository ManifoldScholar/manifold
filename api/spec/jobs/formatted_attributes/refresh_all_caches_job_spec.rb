require 'rails_helper'

RSpec.describe FormattedAttributes::RefreshAllCachesJob, type: :job do
  let(:expected_count) { described_class::MODEL_NAMES.size }

  it "enqueues sub-jobs for each model" do
    expect do
      described_class.perform_now
    end.to have_enqueued_job(FormattedAttributes::RefreshModelCachesJob).exactly(expected_count).times
  end
end
