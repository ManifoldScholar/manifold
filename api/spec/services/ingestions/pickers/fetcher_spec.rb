require "rails_helper"

RSpec.describe Ingestions::Pickers::Fetcher do

  let(:root) { Dir.mktmpdir }
  let!(:outcome) { Ingestions::Pickers::Fetcher.run url: url, root: root}

  context "when no fetcher is found" do
    let(:url) { "an/invalid/file.fail" }

    it "is not valid" do
      expect(outcome).to_not be_valid
    end
  end

  context "when google doc" do
    let(:url) {
      "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/5edit?usp=sharing"
    }
    it "returns the correct fetcher" do
      expect(outcome.result.interaction).to eq Ingestions::Fetchers::GoogleDoc
    end
  end

  context "when a generic URL" do
    let(:url) {
      "https://my-wobsite.com/index.html"
    }
    it "returns the correct fetcher" do
      expect(outcome.result.interaction).to eq Ingestions::Fetchers::URL
    end
  end

end
