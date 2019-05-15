require "rails_helper"

RSpec.describe Updaters::V2::Annotations, updaters_v2: true do

  let!(:text_section) { FactoryBot.create :text_section }
  let!(:creator) { FactoryBot.create :user }

  # create our fake category
  let(:attributes) { {
    start_node: "588704b220406d8f23ec29aa3dae94e1964e2218",
    end_node: "08f5ac474e9309776ae2d85efe57290d367ce4b4",
    start_char: 31,
    end_char: 46,
    subject: "This is my subject",
    # QUESTION if format is reserved, then how do I pass one in?
    # format: "annotation",
    body: "This is an annotation",
    private: false,

    text_section: text_section,
    creator: creator
  } }

  fit "can create an annotation" do
    perform_within_expectation!
  end
end
