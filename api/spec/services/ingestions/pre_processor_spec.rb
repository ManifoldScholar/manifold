require "rails_helper"

RSpec.describe Ingestions::PreProcessor do
  include TestHelpers::IngestionHelper

  let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "non_latin", "index.html") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:context) { create_context(ingestion) }
  let(:manifest) do
    manifest = Ingestions::Strategies::Document.run(context: context).result
    Ingestions::PreProcessor.run(context: context, manifest: manifest).result
  end
  let(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }
  let!(:outcome) { Ingestions::PostProcessor.run(manifest: manifest, text: text, context: context) }

  it "does not unnecessarily change non-latin text" do
    compare = "<div><p>Είναι πλέον</p><p>Είναι πλέον</p></div>"
    expect(text.text_sections.first.body).to eq_ignoring_whitespace compare
  end

end
