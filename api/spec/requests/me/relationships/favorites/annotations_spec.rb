require "rails_helper"

RSpec.describe "Users Annotations API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:user) { FactoryGirl.create(:user) }
  let(:path) { api_v1_me_relationships_annotations_path }

  before(:each) do
    3.times do
      FactoryGirl.create(:annotation, creator: user)
    end
    FactoryGirl.create(:annotation)
  end

  describe "responds with a list of annotations" do
    before(:each) { get path, headers: reader_headers }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

end
