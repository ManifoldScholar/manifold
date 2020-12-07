require 'rails_helper'

RSpec.describe Analytics::RecordLeaveEvent do

  let!(:visit) { FactoryBot.create(:analytics_visit) }

  it "should queue up Analytics::RecordLeaveEventJob" do
    expect do
      described_class.run analytics_visit: visit
    end.to have_enqueued_job(Analytics::RecordLeaveEventJob)
  end

end
