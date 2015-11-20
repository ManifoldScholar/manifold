require "rails_helper"

RSpec.describe Ingestor::Ingestion do
  let(:epub_source_path) { "spec/data/epubs/v3/childrens-literature.epub" }

  it "should raise an error if a path is not passed to the constructor" do
    expect do
      Ingestor::Ingestion.new
    end.to raise_error
  end

  describe "when instantiated" do
    subject { Ingestor::Ingestion.new("/tmp/book.epub") }
    it ("should have a basename accessor") { is_expected.to have_attr_accessor(:basename) }
    it ("should have a source_path accessor") { is_expected.to have_attr_accessor(:source_path) }
    it ("should have a logger accessor") { is_expected.to have_attr_accessor(:logger) }
    it ("should have a extension accessor") { is_expected.to have_attr_accessor(:extension) }
    it ("should have a text accessor") { is_expected.to have_attr_accessor(:text) }
  end

end
