# frozen_string_literal: true

RSpec.describe "Projects API", type: :request do
  let(:project) { FactoryBot.create(:project, draft: false) }

  describe "responds with a list of projects" do
    before(:each) { get api_v1_projects_path, headers: reader_headers }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end

    describe "it allows searching by keyword", :elasticsearch do
      before(:each) do
        FactoryBot.create(:project, title: "foo")
        path = api_v1_projects_path(params: { filter: { keyword: "foo" } })
        get path, headers: reader_headers
      end

      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "sends a single project" do
    let(:path) { api_v1_project_path(project) }

    context "when the user is an reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { get path, headers: admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "creates a project" do
    let(:path) { api_v1_projects_path }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 201 SUCCESS status code" do
        params = build_json_payload(attributes: { title: "foo" })
        post path, headers: headers, params: params
        expect(response).to have_http_status(201)
      end
    end

    context "when the user is not logged in" do
      it "has a 401 status code" do
        params = build_json_payload(attributes: { title: "foo" })
        post path, params: params
        expect(response).to have_http_status(401)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "has a 403 status code" do
        params = build_json_payload(attributes: { title: "foo" })
        post path, headers: headers, params: params
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "updates a project" do
    let(:path) { api_v1_project_path(project) }
    let(:metadata) do
      {
        "isbn" => "1234",
        "publisher" => "Someone",
        "publisherPlace" => "Somewhere",
        "containerTitle" => "The Hardy Boys"
      }
    end
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      let(:john) { FactoryBot.create(:maker, first_name: "John") }
      let(:jim) { FactoryBot.create(:maker, first_name: "Jim") }
      let(:jenny) { FactoryBot.create(:maker, first_name: "Jenny") }

      describe "its creator association" do
        it("can be replaced") do
          project.creators << jenny
          params = build_json_payload(relationships: { creators: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jim.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.creators.reload.pluck(:id)).to contain_exactly(john.id, jim.id)
        end
      end

      describe "its contributors" do
        it("can be replaced") do
          project.contributors << jenny
          params = build_json_payload(relationships: { contributors: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jim.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.contributors.reload.pluck(:id)).to contain_exactly(john.id, jim.id)
        end

        it("are sorted correctly after being set") do
          project.contributors << jenny
          project.contributors << john
          project.save
          expect(project.contributors.reload.pluck(:id)).to eq([jenny.id, john.id])
          params = build_json_payload(relationships: { contributors: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jenny.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.contributors.reload.pluck(:id)).to eq([john.id, jenny.id])
        end
      end

      describe "its creators" do
        it("can be replaced") do
          project.creators << jenny
          params = build_json_payload(relationships: { creators: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jim.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.creators.reload.pluck(:id)).to contain_exactly(jim.id, john.id)
        end

        it("are sorted correctly after being set") do
          project.creators << jenny
          project.creators << john
          project.save
          expect(project.creators.pluck(:id)).to eq([jenny.id, john.id])
          params = build_json_payload(relationships: { creators: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jenny.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.creators.reload.pluck(:id)).to eq([john.id, jenny.id])
        end
      end

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "a title") }
          it("contains the updated metadata") { expect_updated_param("metadata", metadata) }
          it("contains the updated subtitle") { expect_updated_param("subtitle", "a subtitle") }
          it("contains the updated featured boolean value") { expect_updated_param("featured", "true", true) }
          it("contains the updated hashtag") { expect_updated_param("hashtag", "the_hashtag") }
          it("contains the updated description") { expect_updated_param("description", "the description") }
          it("contains the updated tag list") { expect_updated_param("tagList", %w(rowan dog puppy), %w(rowan dog puppy)) }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 forbidden status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "destroys a project" do
    let(:path) { api_v1_project_path(project) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
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
