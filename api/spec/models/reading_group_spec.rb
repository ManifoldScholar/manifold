require "rails_helper"

RSpec.describe ReadingGroup, type: :model do
  it "has a valid factory" do
    reading_group = FactoryBot.build(:reading_group)
    expect(reading_group).to be_valid
  end

  it "can be persisted" do
    expect(FactoryBot.create(:reading_group).persisted?).to be true
  end

  it "has an invitation_code after it's saved" do
    reading_group = FactoryBot.create(:reading_group)
    expect(reading_group.invitation_code.present?).to be true
  end

  it "always has an upper case invitation code" do
    reading_group = FactoryBot.create(:reading_group, invitation_code: "aaaccc123")
    expect(reading_group.invitation_code).to eq "AAACCC123"
    expect(reading_group.reload.invitation_code).to eq "AAACCC123"
  end

  context "when it is destroyed" do

    before(:each) do
      @public_annotation = FactoryBot.create(:annotation, reading_group: reading_group, private: false)
      @private_annotation = FactoryBot.create(:annotation, reading_group: reading_group, private: true)
    end

    context "when it is public" do
      let(:reading_group) { FactoryBot.create(:reading_group, privacy: "public")}
      it "ensures that child annotations are public" do
        reading_group.destroy
        expect(@public_annotation.reload.private).to be false
        expect(@private_annotation.reload.private).to be false
      end
    end

    context "when it is private" do
      let(:reading_group) { FactoryBot.create(:reading_group, privacy: "private")}
      it "ensures that child annotations are private" do
        reading_group.reload.destroy
        expect(@public_annotation.reload.private).to be true
        expect(@private_annotation.reload.private).to be true
      end
    end

    context "when it is anonymous" do
      let(:reading_group) { FactoryBot.create(:reading_group, privacy: "anonymous")}
      it "ensures that child annotations are private" do
        reading_group.reload.destroy
        expect(@public_annotation.reload.private).to be true
        expect(@private_annotation.reload.private).to be true
      end
    end


  end

end
