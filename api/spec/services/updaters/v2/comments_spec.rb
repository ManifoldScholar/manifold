require "rails_helper"

RSpec.describe Updaters::V2::Comments, updaters_v2: true do

  let!(:subject) { FactoryBot.create :subject }
  let!(:creator) { FactoryBot.create :user }

  # create our fake category
  let(:attributes) { {
    body:           Faker::String.random(4),
    subject_type:   Faker::String.random(4),
    deleted:        false,
    children_count: Faker::Number.number(1),
    flags_count:    Faker::Number.number(1),
    sort_order:     Faker::Number.number(1),
    events_count:   Faker::Number.number(1),
    creator:        creator,
    subject:        subject
  } }

  it "can create a comment" do
    # there should be one more category
    perform_within_expectation!
    # perform_within_expectation! do |e|
    #   e.to change(Comment, :count).by(1)
    # end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :comment }

    it "can update the category" do
      perform_within_expectation! do |e|
        e.to keep_the_same(Comment, :count)
      end
    end
  end
end
