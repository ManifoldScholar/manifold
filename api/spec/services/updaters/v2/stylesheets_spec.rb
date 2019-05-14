require "rails_helper"

RSpec.describe Updaters::V2::Stylesheets, updaters_v2: true do

  let!(:creator) { FactoryBot.create :user }
  let!(:text_section) { FactoryBot.create :text_section }

  let(:attributes) { {
    creator:      creator,
    raw_styles:   "style",
    name:         "name",
    position:     1,
    text_sections: text_section
  } }

  it "can create a stylesheet" do
    perform_within_expectation!
  end
end
