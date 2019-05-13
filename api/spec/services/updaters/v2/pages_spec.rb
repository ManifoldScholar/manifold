require "rails_helper"

RSpec.describe Updaters::V2::Pages, updaters_v2: true do
  let!(:creator) { FactoryBot.create :user }

  let(:attributes) { {
    title:            Faker::String.random(4),
    nav_title:        Faker::String.random(4),
    slug:             Faker::String.random(4),
    body:             Faker::String.random(4),
    external_link:    Faker::String.random(4),
    show_in_header:   true,
    hidden:           true,
    is_external_link: true,
    open_in_new_tab:  true,
    purpose:          "supplemental_content",
    creator:          creator
  } }

  it "can create a page" do
    # there should be one more page
    perform_within_expectation! do |e|
      e.to change(Page, :count).by(1)
    end
  end

  context "when updating an existing model" do
    let!(:model) { FactoryBot.create :page }

    it "can update the page" do
      perform_within_expectation! do |e|
        e.to keep_the_same(Page, :count)
      end
    end

  end
end
