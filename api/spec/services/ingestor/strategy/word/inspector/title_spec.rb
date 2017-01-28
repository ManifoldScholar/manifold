require "rails_helper"

RSpec.describe Ingestor::Strategy::Word::Inspector::Title do

  include_context("word ingestion")

  klass = Ingestor::Strategy::Word::Inspector::Title

  let(:source_a) { "/some/path.html" }
  let(:word_inspector_a) { word_inspector(source_a) }

  let(:subject_a) { klass.new(word_inspector_a) }

  it "returns the title" do
    a_value = subject_a.value
    expect(a_value).to eq "Path"
  end

  it "always returns position 1" do
    a_position = subject_a.position
    expect(a_position).to eq(1)
  end

  it "always returns kind main" do
    a_kind = subject_a.kind
    expect(a_kind).to eq ::TextTitle::KIND_MAIN
  end

end

