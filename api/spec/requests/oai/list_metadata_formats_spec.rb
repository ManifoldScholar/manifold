# frozen_string_literal: true

RSpec.describe "OAI PMH List Metadata Formats", type: :request do
  include_context "OAI testing"

  let(:expected_formats) { ["oai_dc"] }
  subject(:response) { client.list_metadata_formats }

  it { is_expected.to be_an_instance_of OAI::ListMetadataFormatsResponse }

  it "contains expected formats" do
    prefix_map = response.map(&:prefix)
    expect(prefix_map).to match_array(expected_formats)
  end
end
