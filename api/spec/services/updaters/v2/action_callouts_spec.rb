require "rails_helper"

RSpec.describe Updaters::V2::ActionCallouts, updaters_v2: true do

  let!(:text) { FactoryBot.create :text }
  let!(:project) { FactoryBot.create :project }

  let(:attributes) { {
    title: "string",
    url: "string",
    kind: 1,
    location: 1,
    button: false,
    project: project,
    text: text
  } }

  it "can create an action callout" do
    perform_within_expectation! do |e|
      e.to change(ActionCallout, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :action_callout }

    it "can update the action_callout" do
      perform_within_expectation! do |e|
        e.to keep_the_same(ActionCallout, :count)
      end
    end
  end
end
