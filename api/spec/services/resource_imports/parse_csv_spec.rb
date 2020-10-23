require "rails_helper"

RSpec.describe ResourceImports::ParseCSV do
  it "can handle non-valid UTF-8 charsets" do
    path = fixture_file_upload(Rails.root.join("spec", "data", "resource_import", "invalid_encoding.csv"), "text/csv")
    import = FactoryBot.create(:resource_import_csv, data: path)

    expect do
      ResourceImports::ParseCSV.run resource_import: import
    end.to_not raise_error
  end

  context "when utf-8 encoded sheet" do
    let(:path) { fixture_file_upload(Rails.root.join("spec", "data", "resource_import", "utf-8.csv"), "text/csv") }
    let(:import) { FactoryBot.create(:resource_import_csv, data: path) }

    before(:each) do
      ResourceImports::ParseCSV.run resource_import: import
    end

    it "parses and maintains the correct characters" do
      expected = [["Header 1", "Header 2"], ["regular value", "value ‘with’ curly “quotes”"]]
      compare = ResourceImportRow.pluck(:values)
      expect(expected[1][1]).to eq compare[1][1]
    end
  end
end
