require "rails_helper"
include ActiveJob::TestHelper

RSpec.shared_examples "after importing" do
  include_context "resource import"

  it "is valid" do
    expect(ri).to be_valid
  end

  it "has an imported state" do
    expect(ri.state_machine.current_state).to eq "imported"
  end

  it "has the correct number of resources" do
    resource_count = ri.data_rows.count
    expect(ri.resources.count).to eq resource_count
  end
end

RSpec.shared_examples "after parsing" do
  include_context "resource import"

  data_path = Rails.root.join("spec", "data", "resource_import", "resources.csv")

  csv = CSV.read(data_path, headers: true)
  data_row_count = csv.count
  column_count = csv.headers.length
  row_count = data_row_count + 1

  it "is valid" do
    expect(ri).to be_valid
  end

  it "has an parsed state" do
    expect(ri.state_machine.current_state).to eq "parsed"
  end

  it "has a resource_import_row for each row in the source document" do
    expect(ri.resource_import_rows.count).to be row_count
  end

  it "flags resource_import_rows prior to the header row as ignored" do
    expect(ri.resource_import_rows.with_type_ignored.count).to be 1
  end

  it "flags the header row as such" do
    expect(ri.resource_import_rows.with_type_header.count).to be 1
  end

  it "flags the remaining rows as data rows" do
    expect(ri.resource_import_rows.with_type_data.count).to be(row_count - 2)
  end

  it "creates rows with a value for each column" do
    expect(ri.resource_import_rows.first.values.length).to be column_count
  end

  it "all of its rows have a pending state" do
    expect(ri.resource_import_rows.in_state(:pending).count).to be row_count
  end

  it "has correct automapping" do
    expected = {
      "Allow High-Res Download" => "allow_download",
      "Alt-Text" => "metadata.alt_text",
      "Caption" => "caption",
      "Collection" => "resource_collections",
      "Copyright Holder" => "metadata.rights_holder",
      "Copyright Status" => "metadata.copyright_status",
      "Creator" => "metadata.creator",
      "Credit Line" => "metadata.credit",
      "Description" => "description",
      "Figure Number" => "metadata.series_number",
      "File ID" => "external_id",
      "File Variant" => "attachment.variant_poster",
      "Filename" => "attachment.attachment",
      "High Res" => "attachment.high_res",
      "Host Name" => "external_type",
      "Keywords" => "tag_list",
      "Restrictions" => "metadata.restrictions",
      "Special Instructions" => "special_instructions",
      "Sub Type" => "sub_kind",
      "Title" => "title",
      "Type" => "kind",
      "URL" => "external_url"
    }
    expect(ri.column_automap_with_headers).to eq expected
  end
end

RSpec.describe ResourceImport, type: :model, slow: true do
  before(:all) do
    Settings.instance.update_from_environment!
  end

  include_context "resource import"

  let(:resource_import) do
    perform_enqueued_jobs do
      ri = FactoryBot.create(:resource_import)
      ri.reload
    end
  end

  let(:google_resource_import) do
    FactoryBot.create(:resource_import_google)
  end

  let(:csv_resource_import) do
    perform_enqueued_jobs do
      ri = FactoryBot.create(:resource_import_csv)
      ri.reload
    end
  end

  let(:parsing_google_resource_import) do
    WebMock.allow_net_connect!
    google_resource_import.state_machine.transition_to(:parsing)
    WebMock.disable_net_connect!
    google_resource_import
  end

  let(:parsing_csv_resource_import) do
    csv_resource_import.state_machine.transition_to(:parsing)
    csv_resource_import
  end

  let(:importing_google_resource_import) do
    parsing_google_resource_import.state_machine.transition_to(:importing, perform_now: true)
    parsing_google_resource_import.column_map = parsing_google_resource_import.column_automap
    parsing_google_resource_import.save
    parsing_google_resource_import
  end

  let(:importing_csv_resource_import) do
    parsing_csv_resource_import.column_map = csv_resource_import.column_automap
    parsing_csv_resource_import.state_machine.transition_to(:mapped)
    parsing_csv_resource_import.state_machine.transition_to(:importing, perform_now: true)
    parsing_csv_resource_import.save
    parsing_csv_resource_import
  end

  let(:ri) do
    resource_import
  end

  it "exposes the header row values as headers" do
    header_row = FactoryBot.build(:resource_import_header_row)
    ri.resource_import_rows << header_row
    ri.save!
    expect(ri.headers.values).to eq header_row.values
  end

  it "offers an array of possible resource attributes" do
    expect(ri.available_columns).to be_an_instance_of(Array)
  end

  it "has a valid factory" do
    expect(FactoryBot.build(:resource_import)).to be_valid
  end

  it "is invalid without a project" do
    ri = FactoryBot.build(:resource_import, project: nil)
    expect(ri).to_not be_valid
  end

  it "is invalid without a creator" do
    ri = FactoryBot.build(:resource_import, creator: nil)
    expect(ri).to_not be_valid
  end

  it "has an initial state of 'pending'" do
    expect(ri.state_machine.current_state).to eq "pending"
  end

  describe "when source is google_sheet" do
    it "is invalid if url is blank" do
      google_resource_import.url = nil
      expect(google_resource_import).to_not be_valid
    end

    context "after parsing it" do
      let(:ri) do
        parsing_google_resource_import
      end
      include_examples "after parsing"
    end
  end

  describe "when source is csv" do
    it "is invalid if data is blank" do
      csv_resource_import.data = nil
      expect(csv_resource_import).to_not be_valid
    end

    context "after parsing" do
      let(:ri) do
        parsing_csv_resource_import
      end
      include_examples "after parsing"
    end

    context "after importing" do
      let(:ri) do
        importing_csv_resource_import
      end
      include_examples "after importing"
    end
  end

  describe "when the import data is invalid" do
    let(:csv_resource_import) do
      FactoryBot.create(
        :resource_import_csv,
        data: fixture_file_upload(Rails.root.join("spec", "data", "resource_import", "invalid_resource.csv"), "text/csv")
      )
    end

    let(:ri) do
      importing_csv_resource_import
    end

    it "has one row" do
      expect(ri.resource_import_rows.with_type_data.count).to be 1
    end

    it "is valid" do
      expect(ri).to be_valid
    end

    it "has an imported state" do
      expect(ri.state_machine.current_state).to eq "imported"
    end

    it "has errors" do
      expect(ri.import_errors?).to be true
    end
  end
end
