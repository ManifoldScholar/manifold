# frozen_string_literal: true

require "rails_helper"

RSpec.describe V1::TextSerializer do
  it_behaves_like "a serializer", partial_by_default: true
  it_behaves_like "a collaborative serializer"

  describe "when the object is a text summary and the serialization is partial" do
    let(:object) do
      FactoryBot.create(:text)
      return TextSummary.first
    end
    subject { described_class.new(object) }

    it "does not include attributes or relationships that are not supported by text summaries" do
      expect(subject.serialized_json).to be_instance_of String
    end
  end
end
