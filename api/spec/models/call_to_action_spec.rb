require "rails_helper"

RSpec.describe CallToAction do
  let(:cta) { FactoryBot.create(:call_to_action) }

  it "has a valid factory" do
    expect(FactoryBot.build(:call_to_action)).to be_valid
  end

  it "is invalid without a title" do
    expect(FactoryBot.build(:call_to_action, title: nil)).to_not be_valid
  end

  it "is invalid without a kind" do
    expect(FactoryBot.build(:call_to_action, kind: nil)).to_not be_valid
  end

  it "is invalid without a location" do
    expect(FactoryBot.build(:call_to_action, location: nil)).to_not be_valid
  end

  describe "#kind" do
    context "when start_reading" do
      let(:cta) { FactoryBot.create(:start_reading_cta, kind: "start_reading") }

      it "is invalid without a text" do
        cta.text = nil
        expect(cta).to_not be_valid
        expect(cta.errors.keys).to include(:text)
      end
    end

    context "when table_of_contents" do
      let(:cta) { FactoryBot.create(:table_of_contents_cta, kind: "table_of_contents") }

      it "is invalid without a text" do
        cta.text = nil
        expect(cta).to_not be_valid
        expect(cta.errors.keys).to include(:text)
      end
    end

    context "when download" do
      let(:cta) { FactoryBot.create(:download_cta, kind: "download") }
    end

    context "when link" do
      let(:cta) { FactoryBot.create(:link_cta, kind: "link") }
    end

    context "when button" do
      let(:cta) { FactoryBot.create(:button_cta, kind: "button") }
    end
  end
end
