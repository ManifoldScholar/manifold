# frozen_string_literal: true

RSpec.describe ExportUploader do
  let_it_be(:text) { FactoryBot.create :text }

  let(:attachment) { text_export.reload.asset }
  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.epub") }
  let(:text_export) { FactoryBot.build(:text_export, :epub_v3, asset: fixture_file_upload(path), text: text) }

  before do
    outcome = Struct.new(:result) do
      def valid?
        true
      end
    end

    allow_any_instance_of(EpubCheck).to receive(:execute).and_return outcome.new({})

    perform_enqueued_jobs { text_export.save }
  end

  it "extracts metadata" do
    expect(attachment.mime_type).to eq("application/zip")
    expect(attachment.extension).to eq("epub")
    expect(attachment.size).to be_instance_of(Integer)
  end

  it "stores epub check results" do
    expect(attachment.metadata["epubcheck"]).to be_a Hash
  end

  it "stores the SHA256 hash" do
    expect(attachment.metadata["sha256"]).to be_a String
  end

  it "adds a file name method to the model" do
    expect(text_export.respond_to?(:asset_file_name)).to be true
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end
end
