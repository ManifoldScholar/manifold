require "rails_helper"

RSpec.describe Updaters::V2::Resources, updaters_v2: true do

  let!(:creators) { FactoryBot.create :user }
  let!(:project) { FactoryBot.create :project }

  let(:attributes) { {
    allow_download: false,
    iframe_allow_fullscreen: false,
    title: "string",
    kind: "string",
    caption: "string",
    description: "string",
    sub_kind: "string",
    external_type: "string",
    external_url: "string",
    external_id: "string",
    embed_code: "string",
    minimum_width: "string",
    minimum_height: "string",
    fingerprint: "string",
    slug: "string",
    project: project,
    creators: creators
  } }

  it "can create a resource" do
    perform_within_expectation!
  end
end
