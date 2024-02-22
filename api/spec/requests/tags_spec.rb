# frozen_string_literal: true

RSpec.describe "Tag API", type: :request do
  before(:each) { 5.times { FactoryBot.create(:tag, name: Faker::Creature::Dog.unique.breed) } }

  describe "responds with a list of tags" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_tags_path
        expect(response).to have_http_status(200)
      end
    end
  end
end
