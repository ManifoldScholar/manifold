# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Ingestions::ProcessJob, type: :job do
  let(:ingestion) { FactoryBot.create(:ingestion) }

  before do
    stub_request(:get, "http://example.com/index.md").
      to_return(status: 200, body: "", headers: {})
  end

  it "runs without issue" do
    expect do
      described_class.perform_now(ingestion, ingestion.creator)
    end.to execute_safely
  end
end
