require "rails_helper"

RSpec.describe Ingestor::Strategy::Word::Inspector::Word do

  include_context("word ingestion")

  let(:source_a) { "/some/path.html" }
  let(:source_b) { "/some/other/path.html" }

  let(:subject_a) { word_inspector(source_a) }
  let(:subject_b) { word_inspector(source_b) }

  it "returns different IDs based for different paths" do
    id_a = subject_a.unique_id
    id_b = subject_b.unique_id
    expect(id_a).to_not eq id_b
  end

  it "returns a stable ID if the path doesn't change" do
    id_a = subject_a.unique_id
    id_b = subject_a.unique_id
    expect(id_a).to eq id_b
  end

  it "returns style content of html file as stylesheet" do
    style_a = subject_a.stylesheet
    expect(style_a).to start_with("<style>")
    expect(style_a).to end_with("</style>")
  end

end

