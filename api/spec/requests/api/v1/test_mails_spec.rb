require "swagger_helper"

RSpec.describe "Test Mail", type: :request do

  include_context("authenticated request")

  path "/test_mails" do
    post "Sends a test email" do
      tags "Test Mail"
      security [apiKey: []]

      response "204", "Email sent successfully" do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response "403", I18n.t("swagger.not_authenticated") do
        let(:Authorization) { reader_auth }
        before do |example|
          submit_request(example.metadata)
        end

        it 'returns a 403 response for a reader' do |example|
          assert_response_matches_metadata(example.metadata)
        end
      end

      response "401", I18n.t("swagger.not_authenticated") do
        let(:Authorization) {}
        before do |example|
          submit_request(example.metadata)
        end

        it 'returns a 401 response for an unauthenticated user' do |example|
          assert_response_matches_metadata(example.metadata)
        end
      end
    end
  end
end
