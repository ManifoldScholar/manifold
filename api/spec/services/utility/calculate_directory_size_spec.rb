require "rails_helper"

RSpec.describe Utility::CalculateDirectorySize, interaction: true do
  let_input!(:path) { Pathname.new(Dir.mktmpdir) }

  after(:each) do
    FileUtils.remove_entry_secure path if path.exist? && path.directory?
  end

  def create_test_file!(*parts, size:)
    file_path = path.join(*parts)

    file_path.dirname.mkpath

    IO.copy_stream("/dev/urandom", file_path, size)

    file_path
  end

  context "with an arbitrary file structure" do
    let!(:file_1) { create_test_file! "some_file", size: 10.kilobytes }
    let!(:file_2) { create_test_file! "some/other/file", size: 5.kilobytes }

    let!(:expected_size) { file_1.size + file_2.size }

    it "finds the correct size" do
      perform_within_expectation!

      expect(@outcome.result).to eq expected_size
    end
  end

  context "with a path that does not exist" do
    let_input!(:path) { Rails.root.join("does", "not", "exist") }

    it "returns nil" do
      perform_within_expectation!

      expect(@outcome.result).to be_nil
    end
  end

  context "with a non-directory" do
    let_input!(:path) { Pathname.new(__FILE__) }

    it "fails" do
      perform_within_expectation! valid: false

      expect(@outcome).to have(1).error_on(:path)
    end
  end
end
