# frozen_string_literal: true

RSpec.describe "OAI PMH Identify", type: :request do
  include_context "OAI testing"
  subject(:response) { client.identify }

  it { is_expected.to be_an_instance_of OAI::IdentifyResponse }
end
