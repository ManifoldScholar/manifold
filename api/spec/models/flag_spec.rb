require "rails_helper"

RSpec.describe Flag, type: :model do

  it "has a valid flag factory" do
    expect(FactoryBot.build(:flag)).to be_valid
  end

  it "enqueues an EnqueueFlagNotificationsJob job on create" do
    comment = FactoryBot.create(:comment)
    expect(Notifications::EnqueueFlagNotificationsJob).to receive(:perform_later)
    FactoryBot.create(:flag, flaggable: comment)
  end

  describe "is invalid when" do
    let(:flag) { FactoryBot.build(:flag) }

    it "flaggable is nil" do
      flag.flaggable = nil
      expect(flag).to_not be_valid
    end
  end
end
