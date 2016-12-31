require "rails_helper"

RSpec.describe "Categories API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  describe "sends a category" do

    let(:category) { FactoryGirl.create(:category, role: Category::ROLE_TEXT) }

    describe "the response" do
      it "has a 200 status code" do
        get api_v1_category_path(category)
        expect(response).to have_http_status(200)
      end
    end
  end
end
