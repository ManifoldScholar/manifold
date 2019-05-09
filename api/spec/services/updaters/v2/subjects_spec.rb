require "rails_helper"

RSpec.describe Updaters::V2::Subjects, updaters_v2: true do
  let(:attributes) { { name: Faker::Name.name } }

  it "can create a subject" do
    perform_within_expectation! do |e|
      e.to change(Subject, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :subject }

    it "can update the subject" do
      perform_within_expectation! do |e|
        e.to keep_the_same(Subject, :count)
      end
    end
  end
end
