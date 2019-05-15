require "rails_helper"

RSpec.describe Updaters::V2::ProjectCollections, updaters_v2: true do

  let!(:creator) { FactoryBot.create :user }

  let(:attributes) { {
    smart: true,
    visible: true,
    homepage: true,
    featured_only: true,
    title: "string",
    sort_order: "string",
    icon: "string",
    slug: "string",
    number_of_projects: 1,
    description: "string",
    homepage_start_date: "string",
    homepage_end_date: "string",
    homepage_count: 1,
    creator: creator
  } }

  it "can create a project collection" do
    perform_within_expectation! do |e|
      e.to change(ProjectCollection, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :project_collection }

    it "can update the project collection" do
      perform_within_expectation! do |e|
        e.to keep_the_same(ProjectCollection, :count)
      end
    end
  end
end
