require 'rails_helper'

RSpec.describe FormattedAttributes::RefreshCacheJob, type: :job do
  let!(:project) { FactoryBot.create :project }

  it "refreshes an individual model's formatted attributes" do
    expect(project).to receive(:refresh_formatted_attributes_cache!).once.and_call_original

    expect do
      described_class.perform_now project
    end.to execute_safely
  end
end
