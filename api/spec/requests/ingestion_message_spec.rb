# frozen_string_literal: true

RSpec.describe "Ingestion Messages API", type: :request do
  let(:ingestion) { FactoryBot.create(:ingestion) }
  let(:path) { api_v1_ingestion_relationships_ingestion_messages_path(ingestion) }

  before do
    stub_request(:get, "http://example.com/index.md").
     to_return(status: 200, body: "", headers: {})
  end

  it "can respond with messages about an ingestion" do
    ingestion.process(ingestion.creator)
    get path, headers: admin_headers, params: { starting_at: "2024-12-24" }
    expect(response).to have_http_status(:success)
    expect(response.parsed_body['data'].length > 0).to be true
  end

  it "unprocessed ingestions have no messages" do
    get path, headers: admin_headers, params: { starting_at: "2024-12-24" }
    expect(response).to have_http_status(:success)
    expect(response.parsed_body['data'].length).to be 0
  end

  it "only returns ingestion messages after the requested timestamp" do
    ingestion.process(ingestion.creator)
    perform_enqueued_jobs
    second_to_last_timestamp = ingestion.ingestion_messages.sort_by(&:created_at)[-2].created_at
    get path, headers: admin_headers, params: { starting_at: second_to_last_timestamp.strftime('%Y-%m-%d %H:%M:%S.%N') }
    expect(response).to have_http_status(:success)
    expect(response.parsed_body['data'].length).to be 2
  end

  it "can handle every ingestion message type" do
    types = [:start_message, :info, :warn, :error, :fatal, :unknown, :entity, :end_message]
    types.each do |trait|
      FactoryBot.create(:ingestion_message, trait, ingestion: ingestion)
    end

    get path, headers: admin_headers, params: { starting_at: "2024-12-24" }
    expect(response).to have_http_status(:success)
    data = response.parsed_body['data']
    expect(data.length).to be 8
    data.each.with_index do |entry, idx|
      kind = entry.dig('attributes', 'kind')
      if kind != 'log'
        expect(kind).to eq(types[idx].to_s.split('_')[-1])
      end
    end
  end
end
