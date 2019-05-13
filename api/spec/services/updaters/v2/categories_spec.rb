require "rails_helper"

RSpec.describe Updaters::V2::Categories, updaters_v2: true do

  let!(:project) { FactoryBot.create :project }

  let(:attributes) { {
    title:     "Some category",
    role:      "text",
    position:  1,
    project:   project
  } }

  it "can create a category" do
    # there should be one more category
    perform_within_expectation!
    # perform_within_expectation! do |e|
    #   e.to change(Category, :count).by(1)
    # end
  end

  # context "when updating an existing model" do
  #   let!(:model) { FactoryBot.create :category }
  #
  #   it "can update the category" do
  #     perform_within_expectation! do |e|
  #       e.to keep_the_same(Category, :count)
  #     end
  #   end
  # end
  #
  # context "with a relative position" do
  #   let(:position) { "up" }
  #   it "can create a category" do
  #     perform_within_expectation! do |e|
  #       e.to keep_the_same(Category, :count)
  #     end
  #   end
  # end
end
