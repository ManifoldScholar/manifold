require "rails_helper"

RSpec.shared_context "word ingestion" do

  let(:html) {
    Nokogiri::HTML("<!DOCTYPE html><html><head><style>inside style tags</style></head><body>inside body tags</body></html>")
  }

  def word_inspector(path)
    inspector = Ingestor::Strategy::Word::Inspector::Word.new(path)
    allow(inspector).to receive(:relative_path).and_return(path)
    allow(inspector).to receive(:get_contents_from_path).and_return(html)
    return inspector
  end

end
