require "rails_helper"

RSpec.describe Updaters::V2::Collaborators, updaters_v2: true do

  let!(:maker) { FactoryBot.create :maker }

  let(:attributes) { {
      role:           "string",
      maker:          maker
  } }

  it "can create a collaborator" do
    perform_within_expectation!
  end
end
