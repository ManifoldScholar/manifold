require "rails_helper"

RSpec.describe Updaters::V2::Comments, updaters_v2: true do

  let!(:subject) { FactoryBot.create :subject }
  let!(:creator) { FactoryBot.create :user }

  # create our fake category
  let(:attributes) { {
    body:           "This is a comment",
    deleted:        false,
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

  # context "when updating an existing model" do
  #   let!(:model) { FactoryBot.create :comment }
  #
  #   it "can update the category" do
  #     perform_within_expectation! do |e|
  #       e.to keep_the_same(Comment, :count)
  #     end
  #   end
  # end
end
