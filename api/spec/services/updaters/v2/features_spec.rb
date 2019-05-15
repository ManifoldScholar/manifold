require "rails_helper"

RSpec.describe Updaters::V2::Features, updaters_v2: true do

  let!(:creator) { FactoryBot.create :user }

  let(:attributes) { {
    creator:              creator,
    hidden:               false,
    header:               "string",
    subheader:            "string", # not required
    body:                 "string",
    link_text:            "string",
    link_url:             "string",
    link_target:          "string",
    style:                "dark",
    background_color:     "string", # not required
    foreground_color:     "string", # not required
    header_color:         "string", # not required
    layout:               "string", # not required
    foreground_top:       "1.9em",
    foreground_left:      "1.9em",
    foreground_position:  "absolute",
    live:                 false,
    include_sign_up:      false,
    position:             1
  } }

  it "can create a feature" do
    perform_within_expectation! do |e|
      e.to change(Feature, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :feature }

    it "can update the feature" do
      perform_within_expectation! do |e|
        e.to keep_the_same(Feature, :count)
      end
    end
  end
end
