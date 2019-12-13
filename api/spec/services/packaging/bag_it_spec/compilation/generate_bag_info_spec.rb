require "rails_helper"

RSpec.describe Packaging::BagItSpec::Compilation::GenerateBagInfo, packaging: true do
  let!(:project) { FactoryBot.create :project }
  let!(:tmp_root) { Dir.mktmpdir ["generate-bag-info", "spec"], Rails.root.join("tmp") }
  let!(:project_context) { Packaging::BagItSpec::Context.new project, tmp_root: tmp_root }
  let!(:build_path) { Pathname.new(__dir__) }
  let!(:state) do
    {
      build_path: build_path,
      context:    project_context
    }
  end

  let!(:operation) { described_class.new }

  after(:each) do 
    FileUtils.remove_entry_secure tmp_root
  end

  it "generates a resource proxy" do
    expect(operation.call(state)).to match_dry_type Types::STRING_MAP
  end
end
