require "rails_helper"

RSpec.describe "Test Mails API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  context "when the user is an admin" do
    let(:path) { api_v1_test_mails_path }
    before(:each) { post path, headers: admin_headers}
    it "has a 204 status code" do
      expect(response).to have_http_status(204)
    end
  end

  context "when the user is not an admin" do
    let(:path) { api_v1_test_mails_path }
    before(:each) { post path, headers: reader_headers}
    it "has a 403 status code" do
      expect(response).to have_http_status(403)
    end
  end

end
