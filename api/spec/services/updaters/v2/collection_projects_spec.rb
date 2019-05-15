require "rails_helper"

RSpec.describe Updaters::V2::CollectionProjects, updaters_v2: true do

  let!(:project) { FactoryBot.create :project }
  let!(:project_collection) { FactoryBot.create :project_collection }

  let(:attributes) { {
    position: 1,
    project: project,
    project_collection: project_collection
  } }

  it "can create a collection of projects" do
    perform_within_expectation! do |e|
      e.to change(CollectionProject, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :collection_project }

    fit "can update the collection of projects" do
      perform_within_expectation! do |e|
        e.to keep_the_same(CollectionProject, :count)
      end
    end

  end
end
