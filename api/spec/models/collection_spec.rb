require "rails_helper"

RSpec.describe Collection, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:collection)).to be_valid
  end

  it "belongs to a project" do
    collection = FactoryGirl.create(:collection)
    expect(collection.project).to be_a Project
  end

  it "destroys associated annotations" do
    collection = FactoryGirl.create(:collection)
    FactoryGirl.create(:annotation, collection: collection)
    expect { collection.destroy }.to change { Annotation.count }.from(1).to(0)
  end

end
