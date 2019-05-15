require "rails_helper"

RSpec.describe Updaters::V2::Projects, updaters_v2: true do
  let(:avatar) { attachment_map "avatar.png", manifold_logo_data_uri }
  let!(:creator) { FactoryBot.create :user }

  let(:attributes) { {
    avatar:                  avatar,
    creator:                 creator,
    title:                   "title",
    subtitle:                "string",
    featured:                true,
    hashtag:                 "string",
    description:             "string",
    purchase_url:            "http://fakeurl.com",
    purchase_price_currency: "dollars",
    purchase_call_to_action: "string",
    hide_activity:           true,
    download_url:            "string",
    download_call_to_action: "string",
    publication_date:        "string",
    avatar_color:            "string",
    slug:                    "string",
    dark_mode:               true,
    image_credits:          "string",
  } }

  it "can create a user" do
    perform_within_expectation!
  end
end
