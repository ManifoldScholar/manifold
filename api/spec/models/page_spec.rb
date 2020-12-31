require 'rails_helper'

RSpec.describe Page, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:page)).to be_valid
  end

  it "creates a slug from the nav title" do
    FactoryBot.create(:page, nav_title: "My Page", slug: nil)
    page = Page.last
    expect(page.slug).to eq("my-page")
  end

  context "when external page" do
    it "is invalid without an external_link" do
      page = FactoryBot.build(:page, is_external_link: true, external_link: nil)
      expect(page).to_not be_valid
    end
  end

  context "when purpose is a policy" do
    it "is invalid with a duplicate purpose" do
      FactoryBot.create(:page, purpose: "privacy_policy")
      page = FactoryBot.build(:page, purpose: "privacy_policy")
      expect(page).to_not be_valid
    end
  end

  it_should_behave_like "a model with formatted attributes"
end
