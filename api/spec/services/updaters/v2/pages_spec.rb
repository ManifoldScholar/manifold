require "rails_helper"

RSpec.describe Updaters::V2::Pages, updaters_v2: true do
  let!(:creator) { FactoryBot.create :user }

  let(:title) { Faker::String.random(4) }
  let(:nav_title) { Faker::String.random(4) }
  let(:slug) { Faker::String.random(4) }
  let(:body) { Faker::String.random(4) }
  let(:external_link) { Faker::String.random(4) }

  let(:show_in_header) { true }
  let(:hidden) { true }
  let(:is_external_link) { true }
  let(:open_in_new_tab) { true }

  let(:attributes) { {
    title: title,
    nav_title: nav_title,
    slug: slug,
    body: body,
    external_link: external_link,
    show_in_header: show_in_header,
    hidden: hidden,
    is_external_link: is_external_link,
    open_in_new_tab: open_in_new_tab
  } }

  it "can create a page" do
    # there should be one more page
    perform_within_expectation! do |e|
      e.to change(Page, :count).by(1)
    end
  end

  # context "when updating an existing model" do
  #   let!(:model) { FactoryBot.create :page }
  #
  #   it "can update the page" do
  #     perform_within_expectation! do |e|
  #       e.to keep_the_same(Page, :count)
  #     end
  #   end

  # end
end
