# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Ingestions", type: :request do
  include ActiveJob::TestHelper
  path "/ingestions/{id}" do
    include_examples "an API update request", model: Ingestion, authorized_user: :admin
    include_examples "an API show request",
                     model: Ingestion,
                     authorized_user: :admin,
                     included_relationships: [:creator]
  end

  context "for a project" do
    let!(:ingestion) { FactoryBot.create(:ingestion) }
    let!(:project_id) { ingestion.project_id }

    path "/projects/{project_id}/relationships/ingestions" do
      include_examples "an API create request",
                       parent: "project",
                       model: Ingestion,
                       url_parameters: [:project_id],
authorized_user: :admin,
                       included_relationships: [:creator]
    end
  end

  context "for a text section" do
    let!(:text) { FactoryBot.create(:text) }
    let(:text_id) { text.id }

    path "/texts/{text_id}/relationships/ingestions" do
      include_examples "an API create request",
                       model: Ingestion,
                       parent: "text",
                       url_parameters: [:text_id],
                       authorized_user: :admin,
                       included_relationships: [:creator]
    end
  end

  context "ingestion processing" do
    let!(:ingestion) { FactoryBot.create(:ingestion) }
    let!(:project_id) { ingestion.project_id }

    before do
      stub_request(:get, "http://example.com/index.md").
        to_return(status: 200, body: "", headers: {})
    end

    it "can start ingestion processing" do
      patch "/api/v1/ingestions/#{ingestion.id}/process_ingestion"
      perform_enqueued_jobs
      ingestion.reload

      expect(ingestion.finished?).to be true
      expect(response).to have_http_status(:success)
    end

    it "can reingest an ingestion" do
      ingestion.process(ingestion.creator)
      patch "/api/v1/ingestions/#{ingestion.id}/reingest"
      perform_enqueued_jobs
      ingestion.reload
      expect(ingestion.finished?).to be true
      expect(response).to have_http_status(:success)
    end

    it "can reset an ingestion" do
      ingestion.process(ingestion.creator)
      patch "/api/v1/ingestions/#{ingestion.id}/reset"
      ingestion.reload
      expect(ingestion.sleeping?).to be true
      expect(response).to have_http_status(:success)
    end

    it "can respond with messages about an ingestion" do
      ingestion.process(ingestion.creator)
      get "/api/v1/ingestions/#{ingestion.id}/show_messages?starting_at=2024-12-24"
      expect(response).to have_http_status(:success)
      body = response.parsed_body
      expect(body['data'].length > 0).to be true
    end

    it "unprocessed ingestions have no messages" do
      get "/api/v1/ingestions/#{ingestion.id}/show_messages?starting_at=2024-12-24"
      expect(response).to have_http_status(:success)
      body = response.parsed_body
      expect(body['data'].length).to be 0
    end

    it "only returns ingestion messages after the requested timestamp" do
      ingestion.process(ingestion.creator)
      second_to_last_timestamp = ingestion.ingestion_messages.sort_by(&:created_at)[-2].created_at
      get "/api/v1/ingestions/#{ingestion.id}/show_messages?starting_at=#{second_to_last_timestamp}"
      expect(response).to have_http_status(:success)
      body = response.parsed_body
      expect(body['data'].length).to be 1
    end
  end
end
