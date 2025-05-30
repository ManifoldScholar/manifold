# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "IngestionMessages", type: :request do
  include ActiveJob::TestHelper
  let!(:ingestion_id) { FactoryBot.create(:ingestion).id }
  path "/ingestions/{ingestion_id}/relationships/ingestion_messages" do
    include_examples "an API index request", model: Ingestion, url_parameters: [:ingestion_id], authorized_user: :admin
  end
end
