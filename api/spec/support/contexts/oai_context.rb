# frozen_string_literal: true

RSpec.shared_context 'OAI testing' do
  let(:client) { OAI::Client.new api_oai_url }

  before do
    WebMock.stub_request(:any, /\A#{api_oai_url}/).to_rack(ManifoldOAI::RackWrapper.new)
  end
end
