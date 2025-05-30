# frozen_string_literal: true

require "rails_helper"

RSpec.describe ActionCallout do
  let(:action_callout) { FactoryBot.create(:action_callout) }

  it "has a valid factory" do
    expect(FactoryBot.build(:action_callout)).to be_valid
  end

  it "is invalid without a title" do
    expect(FactoryBot.build(:action_callout, title: nil)).not_to be_valid
  end

  it "is invalid without a kind" do
    expect(FactoryBot.build(:action_callout, kind: nil)).not_to be_valid
  end

  it "is invalid without a location" do
    expect(FactoryBot.build(:action_callout, location: nil)).not_to be_valid
  end

  describe "#kind" do
    context "when start_reading" do
      let(:action_callout) { FactoryBot.create(:read_action_callout, kind: "read") }

      it "is invalid without a text" do
        action_callout.text = nil
        expect(action_callout).not_to be_valid
        expect(action_callout.errors.attribute_names).to include(:text)
      end
    end

    context "when table_of_contents" do
      let(:action_callout) { FactoryBot.create(:toc_action_callout, kind: "toc") }

      it "is invalid without a text" do
        action_callout.text = nil
        expect(action_callout).not_to be_valid
        expect(action_callout.errors.attribute_names).to include(:text)
      end
    end
  end
end
