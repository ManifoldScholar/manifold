require 'rails_helper'

RSpec.describe FormattedAttributes::RefreshModelCachesJob, type: :job do
  let!(:projects) { FactoryBot.create_list :project, 3 }

  it "enqueues the correct number of jobs for each model" do
    expect do
      described_class.perform_now "Project"
    end.to have_enqueued_job(FormattedAttributes::RefreshCacheJob).exactly(3).times
  end
end
