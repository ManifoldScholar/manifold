RSpec.shared_context "resource import", :shared_context => :metadata do

  before(:each) do
    allow_any_instance_of(ResourceImportRows::Import)
      .to receive(:fetch_google_drive_file) do |import, value|
      if value
        path = Rails.root.join("spec", "data", "resource_import", value)
        next File.open(path) if File.file?(path)
      end
      nil
    end
  end

end
