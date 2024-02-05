# frozen_string_literal: true

require "rails_helper"

RSpec.describe Packaging::BagItSpec::Resources::Proxy do
  let!(:resource) { FactoryBot.create :resource, :image, :with_transcript, :with_translation }

  let!(:proxy) { described_class.new resource }

  let(:attachment_proxy_count) { 3 }

  let(:attachment_entry_count) { 2 }

  # metadata.json
  let(:arbitrary_entry_count) { 1 }

  let(:proxy_entry_count) { arbitrary_entry_count }
  let(:expected_entry_count) { proxy_entry_count + (attachment_proxy_count * attachment_entry_count) }

  it "has the expected number of attachment proxies" do
    expect(proxy).to have(attachment_proxy_count).attachments
  end

  it "has just a single specific entry for metadata" do
    expect(proxy.entries).to have(1).entry

    expect(proxy.entries).to include :metadata
  end

  it "has the expected count of entries" do
    expect do |b|
      proxy.each_entry(include_attachments: true, &b)
    end.to yield_control.exactly(expected_entry_count).times
  end
end
