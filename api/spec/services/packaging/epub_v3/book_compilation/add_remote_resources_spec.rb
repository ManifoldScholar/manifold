# frozen_string_literal: true

require "rails_helper"

RSpec.describe Packaging::EpubV3::BookCompilation::AddRemoteResources, packaging: true do
  let!(:operation) { described_class.new }

  let!(:external_source) { FactoryBot.create :cached_external_source, :png_image }
  let!(:url) { external_source.url }
  let!(:remote_resource) { Packaging::EpubV3::RemoteResourceItem.new url: url, external_source: external_source }

  let!(:book) { double("GEPUB::Book") } # rubocop:todo RSpec/VerifiedDoubles
  let!(:compiled_text) { double("Compiled Text", remote_resources: [remote_resource]) } # rubocop:todo RSpec/VerifiedDoubles
  let!(:item) { double("External Item") } # rubocop:todo RSpec/VerifiedDoubles

  let(:book_context) { double("Book Context", book: book, compiled_text: compiled_text) } # rubocop:todo RSpec/VerifiedDoubles

  before do
    allow(book_context).to receive(:with!).with(:book, :compiled_text).and_yield(book, compiled_text)
  end

  it "adds remote resources" do
    expect(operation).to receive(:add_remote_resource!).once.with(book, remote_resource, 0).and_call_original # rubocop:todo RSpec/MessageSpies
    # rubocop:todo RSpec/StubbedMock
    expect(book).to receive(:add_item).with(url, id: "remote-resource-00001").and_return(item) # rubocop:todo RSpec/MessageSpies, RSpec/StubbedMock
    # rubocop:enable RSpec/StubbedMock
    expect(item).to receive(:set_media_type).with(remote_resource.content_type) # rubocop:todo RSpec/MessageSpies

    expect do
      operation.call book_context
    end.not_to raise_error
  end
end
