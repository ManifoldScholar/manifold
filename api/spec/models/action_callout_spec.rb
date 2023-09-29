require "rails_helper"

RSpec.describe ActionCallout do
  let(:action_callout) { FactoryBot.create(:action_callout) }

  it "has a valid factory" do
    expect(FactoryBot.build(:action_callout)).to be_valid
  end

  it "is invalid without a title" do
    expect(FactoryBot.build(:action_callout, title: nil)).to_not be_valid
  end

  it "is invalid without a kind" do
    expect(FactoryBot.build(:action_callout, kind: nil)).to_not be_valid
  end

  it "is invalid without a location" do
    expect(FactoryBot.build(:action_callout, location: nil)).to_not be_valid
  end

  describe "#kind" do
    context "when start_reading" do
      let(:action_callout) { FactoryBot.create(:read_action_callout, kind: "read") }

      it "is invalid without a text" do
        action_callout.text = nil
        expect(action_callout).to_not be_valid
        expect(action_callout.errors.attribute_names).to include(:text)
      end
    end

    context "when table_of_contents" do
      let(:action_callout) { FactoryBot.create(:toc_action_callout, kind: "toc") }

      it "is invalid without a text" do
        action_callout.text = nil
        expect(action_callout).to_not be_valid
        expect(action_callout.errors.attribute_names).to include(:text)
      end
    end

    context "when download" do
      let(:action_callout) { FactoryBot.create(:download_action_callout, kind: "download") }
    end

    context "when link" do
      let(:action_callout) { FactoryBot.create(:link_action_callout, kind: "link") }
    end
  end
end
