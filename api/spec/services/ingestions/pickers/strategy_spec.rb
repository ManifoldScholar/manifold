require "rails_helper"

RSpec.describe Ingestions::Pickers::Strategy do
  include TestHelpers::IngestionHelper

  shared_examples_for "strategy picker fails" do |path|
    it "to find a valid strategy" do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      @context = create_context(ingestion)
      outcome = Ingestions::Pickers::Strategy.run context: @context
      expect(outcome).to_not be_valid
    end
  end

  shared_examples_for "assigned strategy" do |path, expected|
    it "is the #{expected} strategy" do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return(path.to_s)
      @context = create_context(ingestion)

      @outcome = Ingestions::Pickers::Strategy.run context: @context

      expect(@outcome).to be_valid
      expect(@outcome.result.name).to be expected
    end
  end

  context "when an uningestible source" do
    path = "/some/path/and/file.txt"

    the_subject_behaves_like "strategy picker fails", path
  end

  context "when EPUB" do
    path = Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip")

    the_subject_behaves_like "assigned strategy", path, :epub
  end

  context "when a single HTML file" do
    path = Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html")

    the_subject_behaves_like "assigned strategy", path, :document
  end

  context "when a directory containing a single HTML file" do
    path = Rails.root.join("spec", "data", "ingestion", "html", "minimal-single")

    the_subject_behaves_like "assigned strategy", path, :document
  end

  context "when a google doc", slow: true do
    url = "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing"

    the_subject_behaves_like "assigned strategy", url, :document
  end

  context "when a single markdown file" do
    path = Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md")

    the_subject_behaves_like "assigned strategy", path, :document
  end

  context "when a latex file" do
    path = Rails.root.join("spec", "data", "ingestion", "latex", "example.tex")

    the_subject_behaves_like "assigned strategy", path, :document
  end

end
