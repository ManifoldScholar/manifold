require "rails_helper"

RSpec.describe V1::SearchResultSerializer, elasticsearch: true do
  let(:subject) { described_class.new(object) }
  let(:factory) { described_class.to_s.demodulize.gsub("Serializer", "").underscore.to_sym }

  let(:object) do
    FactoryBot.create(:text)
    FactoryBot.create(:project, title: "bananas")
    Text.reindex
    Resource.reindex
    Annotation.reindex
    TextSection.reindex
    search_options = { keyword: "bananas", page_number: "1", per_page: 20, facets: [:project, :text] }
    outcome = Search::Query.run(search_options)
    outcome.result
  end

  it "successfully serializes the object to a String value" do
    expect(subject.serialized_json).to be_instance_of String
  end
end
