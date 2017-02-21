require "rails_helper"

RSpec.describe Resource, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:resource)).to be_valid
  end

  it "belongs to a project" do
    resource = FactoryGirl.create(:resource)
    expect(resource.project).to be_a Project
  end

  it "is invalid without a title" do
    resource = FactoryGirl.build(:resource, title: "")
    expect(resource).to_not be_valid
  end

  it "has a list of tags" do
    resource = FactoryGirl.create(:resource)
    resource.keywords = "one, two; three"
    resource.save
    expect(resource.tag_list.count).to eq(3)
  end

  it { is_expected.to have_attached_file(:attachment) }

  context "can be filtered" do

    before(:each) do
      @project_a = FactoryGirl.create(:project, title: "project_a")
      @project_b = FactoryGirl.create(:project, title: "project_b")
      @resource_a = FactoryGirl.create(:resource, title: "resource_a", project: @project_a)
      @resource_b = FactoryGirl.create(:resource, title: "resource_b", project: @project_a)
      @resource_c = FactoryGirl.create(:resource, title: "resource_c", project: @project_b, kind: "audio", keywords: "test")
    end

    it "to only include those belonging to a project" do
      results = Resource.filter({project: @project_a})
      expect(results.length).to be 2
      results = Resource.filter({project: @project_b})
      expect(results.length).to be 1
    end

    it "by kind" do
      results = Resource.filter({kind: "image"})
      expect(results.length).to be 2
      results = Resource.filter({kind: "audio"})
      expect(results.length).to be 1
    end

    it "by tag" do
      results = Resource.filter({tag: "dog"})
      expect(results.length).to be 2
      results = Resource.filter({tag: "test"})
      expect(results.length).to be 1
    end
  end
end
