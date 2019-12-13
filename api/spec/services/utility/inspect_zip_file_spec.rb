require "rails_helper"

RSpec.describe Utility::InspectZipFile, interaction: true do
  let(:test_files_path) { Rails.root.join "spec", "data", "zip_files" }
  let!(:test_files) do
    test_files_path.children.each_with_object({}.with_indifferent_access) do |path, h|
      key = path.basename(path.extname).to_s

      h[key] = path.to_s
    end
  end

  context "with a zip file" do
    let_input!(:path) { test_files.fetch(:test) }

    let(:expected_entries) do
      [
        { name: "foo.binary", size: 2048 },
        { name: "nested/bar.binary", size: 2048 }
      ]
    end

    it "finds the correct values" do
      perform_within_expectation!

      expect(@outcome.result).to match_array(expected_entries)
    end
  end

  context "with an empty zip file" do
    let_input!(:path) { test_files.fetch(:empty) }

    it "returns an empty array" do
      perform_within_expectation!

      expect(@outcome.result).to eq []
    end
  end

  context "with a non-existent path" do
    let_input!(:path) { "does/not/exist" }

    it "handles failure gracefully" do
      perform_within_expectation! valid: false

      expect(@outcome).to have(1).error_on :path
    end
  end

  context "with something that is not a zip file" do
    let_input!(:path) { __FILE__ }

    it "handles failure gracefully" do
      perform_within_expectation! valid: false

      expect(@outcome).to have(1).error_on :base
    end
  end
end
