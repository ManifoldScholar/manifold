# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ingestions::PreProcessors::InjectGlobalStyles do
  include TestHelpers::IngestionHelper

  describe "a document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) { Ingestions::Strategies::Document.run(context: context).result }

    around do |example|
      s = Settings.instance
      s.ingestion["global_styles"] = "p { background-color: red }"
      s.save
      example.run
      s.ingestion["global_styles"] = ""
      s.save
    end

    it "injects a global stylesheet into the manifest" do
      s = Settings.instance
      s.ingestion["global_styles"] = "p { background-color: red }"
      s.save
      described_class.run(context: context, manifest: manifest)
    end
  end
end
