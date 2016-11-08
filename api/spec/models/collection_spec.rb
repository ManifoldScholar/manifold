require "rails_helper"

RSpec.describe Collection, type: :model do

  it "belongs to a project" do
    collection = FactoryGirl.create(:collection)
    expect(collection.project).to be_a Project
  end

end
