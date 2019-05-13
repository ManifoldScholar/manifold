require "rails_helper"

RSpec.describe Updaters::V2::Events, updaters_v2: true do

  let!(:subject) { FactoryBot.create :subject }
  let!(:project) { FactoryBot.create :project }
  let!(:twitter_query) { FactoryBot.create :twitter_query }

  let(:attributes) { {
    event_type:             "TEXT_ADDED",
    event_url:              "/browse/resource/1",
    subject_type:           Faker::String.random(4),
    subject_title:          Faker::String.random(4),
    subject_subtitle:       Faker::String.random(4),
    attribution_name:       Faker::String.random(4),
    attribution_url:        Faker::String.random(4),
    attribution_identifier: Faker::String.random(4),
    event_title:            Faker::String.random(4),
    event_subtitle:         Faker::String.random(4),
    external_subject_id:    Faker::String.random(4),
    external_subject_type:  Faker::String.random(4),
    excerpt:                Faker::String.random(4),
    subject:                subject,
    project:                project,
    twitter_query:          twitter_query
  } }

  it "can create a page" do
    perform_within_expectation!
  end
end
