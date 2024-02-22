# frozen_string_literal: true

RSpec.describe "Project Twitter Queries API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  describe "sends a list of a project's twitter queries" do
    let(:path) { api_v1_project_relationships_twitter_queries_path(project) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          get path, headers: headers
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "sends a single project twitter query" do
    before(:each) do
      @twitter_query = FactoryBot.create(:twitter_query, project: project)
    end
    let(:path) { api_v1_twitter_query_path(@twitter_query) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          get path, headers: headers
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "creates a new twitter query for a project" do
    let(:path) { api_v1_project_relationships_twitter_queries_path(project) }
    let(:resource) {
      { attributes: { query: "puppies", active: true },
        relationships: { project: { data: { type: "projects", id: project.id } } } }
    }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: build_json_payload(resource)
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          post path, headers: headers, params: build_json_payload(resource)
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "updates a twitter query" do
    before(:each) do
      @twitter_query = FactoryBot.create(:twitter_query, project: project)
    end
    let(:path) { api_v1_twitter_query_path(@twitter_query) }
    let(:valid_params) { build_json_payload(attributes: { query: "from:rambostoolz" }) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 200 SUCCESS status code" do
        put path, headers: headers, params: valid_params
        expect(response).to have_http_status(200)
      end

      it "updates a twitter query successfully" do
        put path, headers: headers, params: valid_params
        @twitter_query.reload
        expect(@twitter_query.query).to eq "from:rambostoolz"
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      it "has a 403 FORBIDDEN status code" do
        put path, headers: headers, params: valid_params
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "destroys a twitter query" do
    before(:each) do
      @twitter_query = FactoryBot.create(:twitter_query, project: project)
    end
    let(:path) { api_v1_twitter_query_path(@twitter_query) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end

      it "destroys a twitter query successfully" do
        expect{
          delete path, headers: headers
        }.to change{TwitterQuery.count}.by(-1)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      it "has a 403 FORBIDDEN status code" do
        delete path, headers: headers
        expect(response).to have_http_status(403)
      end
    end
  end
end
