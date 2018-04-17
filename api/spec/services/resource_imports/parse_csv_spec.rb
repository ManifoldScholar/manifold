require 'rails_helper'

RSpec.describe ResourceImports::ParseCSV do
  let(:path) { fixture_file_upload(Rails.root.join('spec', 'data','resource_import','invalid_encoding.csv'), 'text/csv') }
  let(:import) { FactoryBot.create(:resource_import_csv, data: path) }

  it "can handle non-valid UTF-8 charsets" do
    expect do
      ResourceImports::ParseCSV.run resource_import: import
    end.to_not raise_error
  end
end
