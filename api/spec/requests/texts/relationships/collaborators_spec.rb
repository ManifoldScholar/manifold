require "rails_helper"

RSpec.describe "Text Collaborators API", type: :request do
  let(:collaborator) do
    FactoryBot.create(:collaborator, maker: maker, collaboratable: text)
  end
  let(:maker) { FactoryBot.create(:maker) }
  let(:text) { FactoryBot.create(:text) }
  it_behaves_like "a controller handling flattened collaborators", :text

  describe "sends text collaborators" do
    let(:path) { api_v1_text_relationships_collaborators_path(text) }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status :ok
      end
    end
  end

  describe "sends a text collaborator" do
    let(:path) { api_v1_text_relationships_collaborator_path(text, collaborator) }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status :ok
      end
    end
  end
end
