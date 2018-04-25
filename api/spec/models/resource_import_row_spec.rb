require "rails_helper"

RSpec.describe ResourceImportRow, type: :model, slow: true do

  include_context "resource import"

  def make_row(values, map)
    row = FactoryBot.create(:resource_import_row, values: values)
    allow(row).to receive(:column_map).and_return(map)
    row
  end

  let(:base) {
    {
      "title" => "The Borg",
      "kind" => "",
      "sub_kind" => "",
      "created_at" => "2/10/17",
      "caption" => "The caption",
      "description" => "The description",
      "fingerprint" => "",
      "external_url" => "",
      "external_id" => "",
      "external_type" => "",
      "allow_high_res" => "",
      "allow_download" => "",
      "embed_code" => "",
      "slug" => "the-borg",
      "minimum_width" => "",
      "minimum_height" => "",
      "iframe_allow_fullscreen" => "",
      "metadata.series_title" => "series title",
      "metadata.container_title" => "container title",
      "metadata.isbn" => "12345",
      "metadata.issn" => "12345",
      "metadata.doi" => "12345",
      "metadata.original_publisher" => "original publisher",
      "metadata.original_publisher_place" => "original publisher place",
      "metadata.original_title" => "original title",
      "metadata.publisher" => "publisher",
      "metadata.publisher_place" => "publisher place",
      "metadata.version" => "version",
      "metadata.series_number" => "series",
      "metadata.edition" => "edition",
      "metadata.issue" => "issue",
      "metadata.volume" => "volume",
      "metadata.rights" => "rights",
      "metadata.rights_territory" => "rights territory",
      "metadata.restrictions" => "restrictions",
      "metadata.rights_holder" => "rights holder",
      "metadata.creator" => "creator",
      "metadata.alt_text" => "alt text",
      "metadata.credit" => "credit",
      "metadata.copyright_status" => "copyright status",
      "metadata.keywords" => "borg;picard;trekkin",
      "attachment.attachment" => "",
      "attachment.high_res" => "",
      "attachment.variant_thumbnail" => "",
      "attachment.variant_poster" => "",
      "attachment.variant_format_one" => "",
      "attachment.variant_format_two" => "",
      "collections" => "",
      "special_instructions" => ""
    }
  }

  let(:column_map) {
    keys = Array (1..base.length)
    keys.zip(base.keys).to_h
  }

  let(:image_values) do
    base.merge("kind" => "image",
               "allow_high_res" => "yes",
               "allow_download" => "yes",
               "attachment.attachment" => "sample.png",
               "attachment.high_res" => "sample.png",
               "attachment.variant_thumbnail" => "sample.png").values
  end

  let(:image_row) do
    make_row(image_values, column_map)
  end

  let(:local_video_values) do
    base.merge("kind" => "video",
               "attachment.attachment" => "sample.mp4",
               "attachment.variant_poster" => "sample.png").values
  end

  let(:local_video_row) do
    make_row(local_video_values, column_map)
  end

  let(:external_video_values) do
    base.merge("kind" => "video",
               "sub_kind" => "external_video",
               "external_type" => "youtube",
               "external_id" => "1234").values
  end

  let(:external_video_row) do
    make_row(external_video_values, column_map)
  end

  let(:audio_values) do
    base.merge("kind" => "audio",
               "attachment.attachment" => "sample.mp3").values
  end

  let(:audio_row) do
    make_row(audio_values, column_map)
  end

  let(:link_values) do
    base.merge("kind" => "link",
               "external_url" => "http://google.com").values
  end

  let(:link_row) do
    make_row(link_values, column_map)
  end

  let(:pdf_values) do
    base.merge("kind" => "pdf",
               "attachment.attachment" => "sample.pdf").values
  end

  let(:pdf_row) do
    make_row(pdf_values, column_map)
  end

  let(:document_values) do
    base.merge("kind" => "document",
               "attachment.attachment" => "sample.rtf").values
  end

  let(:document_row) do
    make_row(document_values, column_map)
  end

  let(:file_values) do
    base.merge("kind" => "file",
               "attachment.attachment" => "sample.zip").values
  end

  let(:file_row) do
    make_row(file_values, column_map)
  end

  let(:spreadsheet_values) do
    base.merge("kind" => "spreadsheet",
               "attachment.attachment" => "sample.xlsx").values
  end

  let(:spreadsheet_row) do
    make_row(spreadsheet_values, column_map)
  end

  let(:presentation_values) do
    base.merge("kind" => "presentation",
               "attachment.attachment" => "sample.pptx").values
  end

  let(:presentation_row) do
    make_row(presentation_values, column_map)
  end

  let(:interactive_values) do
    base.merge("kind" => "interactive",
               "external_url" => "http://google.com").values
  end

  let(:interactive_row) do
    make_row(interactive_values, column_map)
  end

  let(:skip_row) do
    values = base.merge("special_instructions" => "super special instructions.; skip;").values
    make_row values, column_map
  end

  it "has a valid factory" do
    expect(FactoryBot.create(:resource_import_row)).to be_valid
  end

  it "is invalid without a resource_import" do
    rir = FactoryBot.build(:resource_import_row, resource_import: nil)
    expect(rir).to_not be_valid
  end

  it "enqueues an Import job when its state transitions to queued" do
    rir = image_row
    ActiveJob::Base.queue_adapter = :test
    expect {
      rir.state_machine.transition_to(:queued)
    }.to have_enqueued_job(ResourceImportRows::ImportJob)
  end

  describe "after importing" do

    RSpec.shared_examples "Imported resource rows" do |type|
      context "a valid #{type} resource row" do

        let(:row) {
          eval(type)
        }

        it "the resource exists" do
          row.state_machine.transition_to(:importing)
          expect(row.resource).to be_an_instance_of(Resource)
        end

        it "the resource has been saved" do
          row.state_machine.transition_to(:importing)
          expect(row.resource.new_record?).to be false
        end

        it "the resource is valid" do
          row.state_machine.transition_to(:importing)
          expect(row.resource.valid?).to be true
        end

        it "the row's state is :completed" do
          row.state_machine.transition_to(:importing)
          expect(row.state_machine.in_state?(:imported)).to be true
        end
      end
    end

    include_examples "Imported resource rows", "image_row"
    include_examples "Imported resource rows", "local_video_row"
    include_examples "Imported resource rows", "external_video_row"
    include_examples "Imported resource rows", "audio_row"
    include_examples "Imported resource rows", "link_row"
    include_examples "Imported resource rows", "pdf_row"
    include_examples "Imported resource rows", "document_row"
    include_examples "Imported resource rows", "file_row"
    include_examples "Imported resource rows", "spreadsheet_row"
    include_examples "Imported resource rows", "presentation_row"
    include_examples "Imported resource rows", "interactive_row"


    # Generating styles in tests is too slow, but this test was useful during
    # development, so I'm leaving it for now --ZD
    #
    # context "when the resource row is an image" do
    #   it "the attachment styles are generated correctly" do
    #     image_row.state_machine.transition_to(:importing)
    #     resource = image_row.resource
    #     expect(resource.attachment.exists?(:medium)).to be true
    #   end
    # end

    context "when the resource row is invalid" do

      it "include the serialized resource errors" do
        row = FactoryBot.create(:resource_import_row)
        row.state_machine.transition_to(:importing)
        expect(row.import_errors.length >= 1).to be true
      end

      it "its state changes to failed after import" do
        row = FactoryBot.create(:resource_import_row)
        row.state_machine.transition_to(:importing)
        expect(row.state_machine.in_state?(:failed)).to be true
      end

    end

    context "when the resource row is marked skip" do
      it "its state changes to skipped after queue" do
        row = skip_row
        row.state_machine.transition_to(:queued)
        expect(row.state_machine.in_state?(:skipped)).to be true
      end
    end

  end

end
