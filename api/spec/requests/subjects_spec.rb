require "rails_helper"

RSpec.describe "Subject API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  describe "sends a subject" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_subjects_path
        expect(response).to have_http_status(200)
      end
    end
  end
end
