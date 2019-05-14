require "rails_helper"

RSpec.describe Updaters::V2::Events, updaters_v2: true do

  let!(:subject_instance) { FactoryBot.create :text }
  let!(:project) { FactoryBot.create :project }

  let(:attributes) { {
    event_type:             "text_added",
    event_url:              "/browse/resource/1",
    subject_type:           "text",
    subject_title:          "text",
    subject_subtitle:       "text",
    attribution_name:       "text",
    attribution_url:        "text",
    attribution_identifier: "text",
    event_title:            "text",
    event_subtitle:         "text",
    external_subject_id:    "text",
    external_subject_type:  "text",
    excerpt:                "text",
    subject:                subject_instance,
    project:                project

  } }

  it "can create a event" do
    perform_within_expectation!
  end
end
