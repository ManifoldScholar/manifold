require "rails_helper"

RSpec.describe Category, type: :model do

  it "belongs to a project" do
    category = FactoryGirl.create(:category)
    expect(category.project).to be_a Project
  end

end
