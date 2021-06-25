require "rails_helper"

RSpec.describe Ingestions::Compiler do
  include TestHelpers::IngestionHelper
  let(:context) { create_context(ingestion) }
  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }

  it "skips makers when the name cannot be parsed" do
    FactoryBot.create(:maker)
    maker_b = FactoryBot.create(:maker)
    text = FactoryBot.create(:text, makers: [maker_b])
    attributes = { name: "calibre (3.48.0) [https://calibre-ebook.com]"}
    Ingestions::Compilers::Maker.run(
      text: text,
      manifest: {},
      attributes: attributes,
      context: context
    )
    expect(text.makers.count).to be 1
  end

end
