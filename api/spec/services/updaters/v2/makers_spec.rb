require "rails_helper"

RSpec.describe Updaters::V2::Makers, updaters_v2: true do
  let(:avatar) { attachment_map "avatar.png", manifold_logo_data_uri }
  let(:first_name) { Faker::Name.first_name }

  let(:attributes) { { avatar: avatar, first_name: first_name } }

  it "can create a maker" do
    perform_within_expectation! do |e|
      e.to change(Maker, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :maker }

    it "can update the maker" do
      perform_within_expectation! do |e|
        e.to keep_the_same(Maker, :count)
      end
    end
  end
end
