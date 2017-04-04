require "rails_helper"

RSpec.describe "Subject API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:subject_a) { FactoryGirl.create(:subject) }
  let(:subject_b) { FactoryGirl.create(:subject, name: "Rowan") }

  describe "responds with a list of subjects" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_subjects_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "responds with a list of featured project subjects" do
    describe "the response" do
      let(:params) {
        {
          filter: {
            featured: true
          }
        }
      }
      it "has a 200 status code" do
        FactoryGirl.create(:project, subjects: [subject_a])
        FactoryGirl.create(:project, featured: true, subjects: [subject_b])
        get api_v1_subjects_path(params: params)
        entities = JSON.parse(response.body)["data"]
        expect(entities.count).to eq(1)
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "responds with a single subject" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_subject_path(subject_a)
        expect(response).to have_http_status(200)
      end
    end
  end
end
