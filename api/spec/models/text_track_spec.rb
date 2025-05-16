require 'rails_helper'

RSpec.describe TextTrack, type: :model do
  let_it_be(:resource) { FactoryBot.create(:resource) }

  it "has a valid factory" do
    expect(FactoryBot.build(:text_track, resource: resource)).to be_valid
  end

  it "is invalid without a resource" do
    expect(FactoryBot.build(:text_track, resource: nil)).not_to be_valid
  end

  it "is invalid without a kind" do
    expect(FactoryBot.build(:text_track, kind: nil)).not_to be_valid
  end

  context "when kind is subtitles" do
    it "is invalid without srclang" do
      text_track = FactoryBot.build(:text_track, kind: :subtitles, srclang: nil)
      expect(text_track).not_to be_valid
      expect(text_track.errors[:srclang]).to be_present
    end
  end

  context "validates uniqueness" do
    let!(:resource) { FactoryBot.create(:resource) }
    let!(:text_track) { FactoryBot.create(:text_track, resource: resource, kind: :captions, srclang: "en", label: "English") }

    it "does not allow duplicate kind/srclang/label per resource" do
      dup = FactoryBot.build(:text_track, resource: resource, kind: :captions, srclang: "en", label: "English")
      expect(dup).not_to be_valid
      expect(dup.errors[:label]).to be_present
    end
  end
end
