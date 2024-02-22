# frozen_string_literal: true

RSpec.describe "Reading Group Memberships API", type: :request do
  let(:members_per_group) { 3 }

  before(:each) do
    @reading_group = FactoryBot.create(:reading_group, creator: reader)
    @another_reading_group = FactoryBot.create(:reading_group)
    (members_per_group - 1).times do # Minus one, because the creator is also a member
      FactoryBot.create(:reading_group_membership, reading_group: @reading_group)
      FactoryBot.create(:reading_group_membership, reading_group: @another_reading_group)
    end
  end

  describe "sends a list of reading group memberships" do
    describe "the response" do
      let(:headers) { reader_headers }

      before(:each) do
        get api_v1_reading_group_relationships_reading_group_memberships_path(@reading_group), headers: headers
      end

      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end

      it "does not reveal user's personal information" do
        data = JSON.parse(response.body)
        expect(data["included"].second["attributes"]["email"]).to be nil
      end

      it "returns the correct number of members for the reading group" do
        data = JSON.parse(response.body)["data"]
        expect(data.length).to eq members_per_group
      end
    end
  end
end
