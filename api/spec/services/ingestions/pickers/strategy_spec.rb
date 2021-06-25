require "rails_helper"

RSpec.describe Ingestions::Pickers::Strategy do
  include TestHelpers::IngestionHelper

  let(:path) { nil }
  let(:ingestion) {  FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:context) { create_context(ingestion) }
  let(:outcome) { Ingestions::Pickers::Strategy.run context: context }

  shared_examples_for "strategy picker fails" do
    it "to find a valid strategy" do
      expect(outcome).to_not be_valid
    end
  end

  shared_examples_for "assigned strategy" do |expected|
    it "is the #{expected} strategy" do
      expect(outcome).to be_valid
      expect(outcome.result.name).to be expected
    end
  end

  context "when an uningestible source" do
    before(:all) do
      stub_request(:get, "https://some-website/file.txt").
        with(
          headers: {
            'Accept'=>'*/*',
            'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
            'User-Agent'=>'Ruby'
          }).
        to_return(status: 200, body: "blah blah", headers: {})
    end
    let(:url) { "https://some-website/file.txt" }
    let(:ingestion) {  FactoryBot.create :ingestion, :uningested, external_source_url: url }
    the_subject_behaves_like "strategy picker fails"
  end

  context "when EPUB" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    the_subject_behaves_like "assigned strategy", :epub
  end

  context "when a single HTML file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    the_subject_behaves_like "assigned strategy", :document
  end

  context "when a directory containing a single HTML file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single.zip") }

    the_subject_behaves_like "assigned strategy", :document
  end

  context "when a google doc", slow: true do
    before(:all) do
      Settings.instance.update_from_environment!
    end
    let(:url) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
    let(:ingestion) {  FactoryBot.create :ingestion, :uningested, external_source_url: url }

    the_subject_behaves_like "assigned strategy", :document
  end

  context "when a single markdown file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }

    the_subject_behaves_like "assigned strategy", :document
  end

  context "when a latex file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "latex", "example.tex") }

    the_subject_behaves_like "assigned strategy", :document
  end

end
