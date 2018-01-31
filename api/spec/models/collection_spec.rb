require "rails_helper"

RSpec.describe Collection, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:collection)).to be_valid
  end

  it "belongs to a project" do
    collection = FactoryBot.create(:collection)
    expect(collection.project).to be_a Project
  end

  it "is invalid without a title" do
    collection = FactoryBot.build(:collection, title: "")
    expect(collection).to_not be_valid
  end

  it "destroys associated annotations" do
    collection = FactoryBot.create(:collection)
    FactoryBot.create(:annotation, collection: collection)
    expect { collection.destroy }.to change { Annotation.count }.from(1).to(0)
  end

end
