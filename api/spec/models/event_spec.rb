require 'rails_helper'

RSpec.describe Event, type: :model do

  it "belongs to a subject" do
    expect(FactoryGirl.create(:event).subject).to_not be nil
  end

  it "is invalid without a project" do
    expect(FactoryGirl.build(:event, project: nil)).to_not be_valid
  end

  it "is invalid without a subject" do
    expect(FactoryGirl.build(:event, subject: nil)).to_not be_valid
  end

  it "has a valid factory" do
    expect(FactoryGirl.create(:event)).to be_valid
  end

end
