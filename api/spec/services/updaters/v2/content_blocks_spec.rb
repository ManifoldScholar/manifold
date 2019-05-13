require "rails_helper"

RSpec.describe Updaters::V2::ContentBlocks, updaters_v2: true do

  # create a fake project
  let!(:project) { FactoryBot.create :project }

  # create our fake category
  let(:attributes) { {
    type:     "Some category",
    visible:  true,
    position: 1,
    project:  project
  } }

  it "can create a content block" do
    perform_within_expectation!
  end
end
