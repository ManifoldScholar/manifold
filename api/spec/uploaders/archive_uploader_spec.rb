RSpec.describe ArchiveUploader do
  let(:attachment) { project_export.reload.asset }
  let(:path) { Rails.root.join("spec", "data", "zip_files", "test.zip") }
  let(:project_export) { FactoryBot.build(:project_export, :bag_it, asset: fixture_file_upload(path)) }
  before { perform_enqueued_jobs { project_export.save } }

  it "extracts metadata" do
    expect(attachment.mime_type).to eq("application/zip")
    expect(attachment.extension).to eq("zip")
    expect(attachment.size).to be_instance_of(Integer)
    expect(attachment.files).to be_instance_of(Array)
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end
end
