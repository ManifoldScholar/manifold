require "rails_helper"
RSpec.describe AttachmentUploader do
  let(:attachment) { project.reload.avatar }
  let(:path) { Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg") }
  let(:project) { FactoryBot.build(:project, avatar: fixture_file_upload(path)) }
  before { perform_enqueued_jobs { project.save } }

  it "extracts metadata" do
    expect(attachment[:original].mime_type).to eq("image/jpeg")
    expect(attachment[:original].extension).to eq("jpg")
    expect(attachment[:original].size).to be_instance_of(Integer)
  end

  it "includes the original file" do
    expect(attachment.key?(:original)).to be true
  end

  it "contains all variants defined in Attachment::BASE_STYLES" do
    expect(attachment.keys - [:original] && Attachments::BASE_STYLES.keys == Attachments::BASE_STYLES.keys).to be true
  end

  it "is valid" do
    expect(project.valid?).to eq true
  end

  it "promotes the asset to the store" do
    expect(attachment[:original].storage_key).to eq("store")
  end
end
