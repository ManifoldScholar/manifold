require "rails_helper"

RSpec.describe Updaters::V2::ResourceCollections, updaters_v2: true do

  let!(:resource) { FactoryBot.create :resource }
  let!(:project) { FactoryBot.create :project }

  let(:attributes) { {
    title: "string",
    description: "string",
    remove_thumbnail: false,
    project: project,
    resources: resource
  } }

  it "can create a resource collection" do
    perform_within_expectation!
  end
end
