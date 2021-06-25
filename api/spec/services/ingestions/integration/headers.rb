require "rails_helper"

RSpec.describe "When ingesting document without header ids", integration: true do
  include TestHelpers::IngestionHelper

  let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "without_header_ids", "index.html") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

  it "the resulting text has IDs for headers" do
    compare = '<div>
     <h1 id="2015bb5b2b47b5a6e4a87fd4e8d72936">Header 1</h1>
     <p>Lorem ipsum...</p>

     <h2 id="d660ccea7ef8124990a386e40c878c5b">Header 1.3</h2>
     <p>Lorem ipsum...</p>

     <h2 id="a7b560035d1234eacd47e5f15e57fd46">Header 1.3</h2>
     <p>Lorem ipsum...</p>

     <h1 id="a1191322965d835e28e4d46aa589279e">Header 2</h1>
     <p>Lorem ipsum...</p>
     </div>'
    expect(text.result.text_sections.first.body).to eq_ignoring_whitespace compare
  end

  it "resulting text's TOC includes anchors for the generated IDs" do
    expect(text.result.toc.first[:anchor]).to eq "2015bb5b2b47b5a6e4a87fd4e8d72936"
  end

end

