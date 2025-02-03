require "rails_helper"

RSpec.describe "Text Collaborators API", type: :request do
  it_behaves_like "a controller handling flattened collaborators", :text

  let(:text) { FactoryBot.create(:text) }
  let(:maker) { FactoryBot.create(:maker) }
  let(:collaborator) {
    FactoryBot.create(:collaborator, maker: maker, collaboratable: text)
  }

  describe "sends text collaborators" do
    let(:path) { api_v1_text_relationships_collaborators_path(text) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status :ok
      end
    end
  end

  describe "sends a text collaborator" do
    let(:path) { api_v1_text_relationships_collaborator_path(text, collaborator) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status :ok
      end
    end
  end
end
