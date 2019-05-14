require "rails_helper"

RSpec.describe Updaters::V2::Texts, updaters_v2: true do

  let!(:creator) { FactoryBot.create :user }

  let(:attributes) { {
     title:            Faker::String.random(4),
     description:      Faker::String.random(4),
     section_kind:     Faker::String.random(4),
     subtitle:         Faker::String.random(4),
     publication_date: Faker::Date.backward(1),
     published:        true,
     creator:          creator
  } }

  it "can create a text" do
    perform_within_expectation!
    # perform_within_expectation! do |e|
    #   e.to change(Text, :count).by(1)
    # end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :text }

    it "can update the text" do
      perform_within_expectation! do |e|
        e.to keep_the_same(Text, :count)
      end
    end
  end
end
