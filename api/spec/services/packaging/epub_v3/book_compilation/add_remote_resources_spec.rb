require "rails_helper"

RSpec.describe Packaging::EpubV3::BookCompilation::AddRemoteResources, packaging: true do
  let!(:operation) { described_class.new }

  let!(:external_source) { FactoryBot.create :cached_external_source, :png_image }
  let!(:url) { external_source.url }
  let!(:remote_resource) { Packaging::EpubV3::RemoteResourceItem.new url: url, external_source: external_source }

  let!(:book) { double("GEPUB::Book") }
  let!(:compiled_text) { double("Compiled Text", remote_resources: [remote_resource]) }
  let!(:item) { double("External Item") }

  let(:book_context) { double("Book Context", book: book, compiled_text: compiled_text) }

  before do
    allow(book_context).to receive(:with!).with(:book, :compiled_text).and_yield(book, compiled_text)
  end

  it "adds remote resources" do
    expect(operation).to receive(:add_remote_resource!).once.with(book, remote_resource, 0).and_call_original
    expect(book).to receive(:add_item).with(url, id: "remote-resource-00001").and_return(item)
    expect(item).to receive(:set_media_type).with(remote_resource.content_type)

    expect do
      operation.call book_context
    end.not_to raise_error
  end
end
