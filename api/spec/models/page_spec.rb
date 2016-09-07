require 'rails_helper'

RSpec.describe Page, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:page)).to be_valid
  end

  it "creates a slug from the nav title" do
    FactoryGirl.create(:page, nav_title: "My Page", slug: nil)
    page = Page.last
    expect(page.slug).to be("my-page")
  end

end
