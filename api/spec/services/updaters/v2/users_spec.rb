require "rails_helper"

RSpec.describe Updaters::V2::Users, updaters_v2: true do
  let(:avatar) { attachment_map "avatar.png", manifold_logo_data_uri }

  let(:attributes) { {
    avatar:                 avatar,
    email:                  "JohnRambo@rambo.com",
    first_name:             Faker::Name.first_name,
    last_name:              Faker::Name.last_name,
    nickname:                "nikname",
    password:               "password",
    password_confirmation:  "password"
  } }

  it "can create a user" do
    perform_within_expectation! do |e|
      e.to change(User, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :user }

    it "can update the user" do
      perform_within_expectation! do |e|
        e.to keep_the_same(User, :count)
      end
    end
  end
end
