# frozen_string_literal: true

RSpec.describe "OAI PMH API", type: :request do
  let(:client) { OAI::Client.new api_oai_url }
  subject(:response) { client.list_records }

  before do
    WebMock.stub_request(:any, %r{\A#{api_oai_url}}).to_rack(ManifoldOAI::RackWrapper.new)
  end

  it { is_expected.to be_an_instance_of OAI::ListRecordsResponse }
end
