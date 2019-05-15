require "rails_helper"

RSpec.describe Updaters::V2::TwitterQuery, updaters_v2: true do

  let!(:creator) { FactoryBot.create :user }
  let!(:project) { FactoryBot.create :project }
  # QUESTION where does one create a result?

  let(:attributes) { {
    creator:     creator,
    project:     project,
    query:       "string",
    active:      true,
    result_type: "string"
  } }

  it "can create a TwitterQuery" do
    perform_within_expectation!
  end
end
