# frozen_string_literal: true

RSpec.describe API::V1::Ingestions::Relationships::IngestionMessagesController, type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project, creator: project_creator) }
  let_it_be(:ingestion, refind: true) { FactoryBot.create(:ingestion, project:) }
  let_it_be(:other_ingestion, refind: true) { FactoryBot.create(:ingestion) }

  let_it_be(:ingestion_messages, refind: true) do
    [
      FactoryBot.create(:ingestion_message, :start_message, ingestion:, created_at: 2.hours.ago),
      FactoryBot.create(:ingestion_message, :info, ingestion:, created_at: 90.minutes.ago),
      FactoryBot.create(:ingestion_message, :warn, ingestion:, created_at: 70.minutes.ago),
      FactoryBot.create(:ingestion_message, :unknown, ingestion:, created_at: 50.minutes.ago),
      FactoryBot.create(:ingestion_message, :end_message, ingestion:),
    ]
  end

  let(:starting_at) { nil }
  let(:params) { { starting_at: } }

  shared_examples_for "visible ingestion messages" do
    it "returns ingestion messages" do
      expect do
        get path, headers:
      end.to execute_safely

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"]).to have(5).items
    end

    context "when filtering by starting_at" do
      let(:starting_at) { 40.minutes.ago.iso8601 }

      it "returns ingestion messages created after the starting_at time" do
        expect do
          get path, headers:
        end.to execute_safely

        expect(response).to have_http_status(:ok)

        expect(response.parsed_body["data"]).to have(1).item
      end
    end
  end

  context "GET /api/v1/ingestions/:ingestion_id/relationships/ingestion_messages" do
    let(:path) { api_v1_ingestion_relationships_ingestion_messages_path(ingestion, params:) }
    let(:other_path) { api_v1_ingestion_relationships_ingestion_messages_path(other_ingestion, params:) }

    context "as an admin" do
      let(:headers) { admin_headers }

      it_behaves_like "visible ingestion messages"

      context "when trying to read messages for an unaffiliated ingestion" do
        let(:path) { other_path }

        it "allows access" do
          expect do
            get path, headers:
          end.to execute_safely

          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "as the project creator" do
      let(:headers) { project_creator_headers }

      it_behaves_like "visible ingestion messages"

      context "when trying to read messages for an unaffiliated ingestion" do
        let(:path) { other_path }

        it "forbids access" do
          expect do
            get path, headers:
          end.to execute_safely

          expect(response).to have_http_status(:forbidden)
        end
      end
    end

    context "as a marketeer" do
      let(:headers) { marketeer_headers }

      it_behaves_like "visible ingestion messages"
    end

    context "as a reader" do
      let(:headers) { reader_headers }

      it "forbids access" do
        expect do
          get path, headers:
        end.to execute_safely

        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
