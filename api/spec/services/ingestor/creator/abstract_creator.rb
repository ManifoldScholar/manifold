require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe Ingestor::Creator::AbstractCreator do

  let(:text) { FactoryGirl.create(:text) }
  let(:creator) { Ingestor::Creator::AbstractCreator.new(Rails.logger, text) }

  it "responds to logger methods" do
    expect(creator).to respond_to(:info)
    expect(creator).to respond_to(:debug)
    expect(creator).to respond_to(:error)
    expect(creator).to respond_to(:warn)
  end
end
