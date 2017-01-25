require "rails_helper"

RSpec.describe "Statistics API", type: :request do

  include_context("authenticated request")

  let(:stats) { Statistics.new }

  describe "sends statistics" do

    context "when the user is an admin" do
      before(:each) { get api_v1_statistics_path, headers: admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      before(:each) { get api_v1_statistics_path, headers: reader_headers }
      describe "the response" do
        it "has a 403 forbidden status code" do
          expect(response).to have_http_status(403)
        end
      end
    end

  end

end
