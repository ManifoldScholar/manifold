# frozen_string_literal: true

require "rails_helper"

RSpec.describe SharedUploader::TypePredicates do
  subject(:uploaded_file) do
    AttachmentUploader::UploadedFile.new("id" => id, "storage" => "cache", "metadata" => metadata)
  end

  describe "#matches_type?" do
    context "when the mime type is an image but the extension is missing" do
      let(:id) { "cover" }
      let(:metadata) { { "mime_type" => "image/jpeg" } }

      it "is recognized as an image via mime type" do
        expect(uploaded_file.extension).to be_blank
        expect(uploaded_file.image?).to be true
      end
    end

    context "when the extension is an image but the mime type is missing" do
      let(:id) { "cover.png" }
      let(:metadata) { {} }

      it "is recognized as an image via extension" do
        expect(uploaded_file.image?).to be true
      end
    end

    context "when neither the mime type nor the extension match" do
      let(:id) { "notes.txt" }
      let(:metadata) { { "mime_type" => "text/plain" } }

      it "is neither an image nor a pdf" do
        expect(uploaded_file.image?).to be false
        expect(uploaded_file.pdf?).to be false
      end
    end

    context "when the mime type is a pdf" do
      let(:id) { "doc" }
      let(:metadata) { { "mime_type" => "application/pdf" } }

      it "is recognized as a pdf" do
        expect(uploaded_file.pdf?).to be true
      end
    end
  end
end
