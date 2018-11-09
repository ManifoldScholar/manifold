require "rails_helper"

RSpec.describe "Tag API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  before(:each) { 5.times { FactoryBot.create(:tag, name: Faker::Dog.unique.breed) } }

  describe "responds with a list of tags" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_tags_path
        expect(response).to have_http_status(200)
      end
    end
  end
end
