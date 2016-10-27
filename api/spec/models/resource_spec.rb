require "rails_helper"

RSpec.describe Resource, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:resource)).to be_valid
  end

  it "belongs to a project" do
    resource = FactoryGirl.create(:resource)
    expect(resource.project).to be_a Project
  end

  it { is_expected.to have_attached_file(:attachment) }

end
