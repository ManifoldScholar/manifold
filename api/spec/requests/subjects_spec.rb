# frozen_string_literal: true

RSpec.describe "Subject API", type: :request do
  let(:subject_a) { FactoryBot.create(:subject) }
  let(:subject_b) { FactoryBot.create(:subject, name: "Rowan") }

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
      let(:params) do
        {
          filter: {
            featured: true
          }
        }
      end

      it "has a 200 status code" do
        FactoryBot.create(:project, subjects: [subject_a])
        FactoryBot.create(:project, featured: true, subjects: [subject_b])
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
