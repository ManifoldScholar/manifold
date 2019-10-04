require "swagger_helper"

RSpec.describe "Reading Groups API", type: :request do

  model_name = 'reading_group'
  model_name_plural = 'reading_groups'

  create_request_schema = { '$ref' => '#/definitions/ReadingGroupRequestCreate' }
  create_response_schema = { '$ref' => '#/definitions/ReadingGroupUpdateResponse' }

  update_request_schema = { '$ref' => '#/definitions/ReadingGroupRequestUpdate' }
  update_response_schema = { '$ref' => '#/definitions/ReadingGroupUpdateResponse' }

  single_record_response = { '$ref' => '#/definitions/ReadingGroupResponse' }
  multiple_record_response = { '$ref' => '#/definitions/ReadingGroupsResponse' }

  include_context("authenticated request")
  include_context("param helpers")

  let(:reading_group) { FactoryBot.create(:reading_group, creator: reader) }

  path "/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        let(:Authorization) { admin_auth }
        schema multiple_record_response
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do

      parameter name: :body, in: :body, schema: update_request_schema
      let(:body) { json_structure_for(model_name) }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }
        schema create_response_schema
        run_test!
      end
    end
  end

  path "/#{model_name_plural}/{id}" do
    accessor_attribute = 'ID'
    let(:id) { reading_group[:id] }

    get I18n.t('swagger.get.one.description', type: model_name_plural, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.get.one.200', type: model_name_plural, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema single_record_response
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string

      parameter name: :body, in: :body, schema: update_request_schema
      let(:body) { json_structure_for(model_name) }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema update_response_schema
        run_test!
      end

      response '403', I18n.t("swagger.access_denied") do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string

      security [ apiKey: [] ]
      tags model_name_plural

      response '204', I18n.t('swagger.delete.204', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t("swagger.access_denied") do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "responds with a list of reading groups" do

    describe "the response" do

      before(:each) { get api_v1_reading_groups_path, headers: headers }

      context "when the user is a reading group owner" do
        let(:headers) { reader_headers }
        it "has a 403 status code" do
          expect(response).to have_http_status(403)
        end
      end

      context "when the user is an admin" do
        let(:headers) { admin_headers }
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "sends a reading group" do
    describe "the response" do

      context "when the id is provided" do
        before(:each) { get api_v1_reading_group_path(reading_group), headers: headers }
        context "when the user is the reading group owner" do

          let(:headers) { reader_headers }
          it "has a 200 status code" do
            expect(response).to have_http_status(200)
          end
        end

        context "when the user is not in the reading group" do

          let(:headers) { another_reader_headers }
          it "has a 403 status code" do
            expect(response).to have_http_status(403)
          end
        end

        context "when the user is an admin" do

          let(:headers) { admin_headers }
          it "has a 200 status code" do
            expect(response).to have_http_status(200)
          end
        end

      end

      context "when the invitation code is provided" do

        before(:each) { get api_v1_reading_group_path(reading_group.invitation_code), headers: headers }

        context "when the user is not in the reading group" do

          let(:headers) { another_reader_headers }
          it "has a 200 status code" do
            expect(response).to have_http_status(200)
          end
        end
      end

    end
  end

  describe "updates a reading group" do

    let(:path) { api_v1_reading_group_path(reading_group) }

    context "when the user is the reading group owner" do

      let(:headers) { reader_headers }
      let(:metadata) {
        {
          name: "This is a new name"
        }
      }

      describe "the response" do
        context "body" do
          it("contains the updated name") { expect_updated_param("name", "This is the new name") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is not the reading group owner" do

      let(:headers) { another_reader_headers }
      let(:metadata) {{ name: "This is a new name" }}

      describe "the response" do
        it "has a 403 status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do

      let(:headers) { admin_headers }
      let(:metadata) {{ name: "This is a new name" }}

      describe "the response" do
        it "has a 200 status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "creates a reading_group" do
    let (:path) { api_v1_reading_groups_path }
    let(:attributes) {
      {
        name: "My Reading Group"
      }
    }
    let(:valid_params) {
      json_payload(attributes: attributes)
    }

    it "has a 201 CREATED status code" do
      post path, headers: reader_headers, params: valid_params
      expect(response).to have_http_status(201)
    end
  end

  describe "deletes a reading_group" do
    let(:path) { api_v1_reading_group_path(reading_group) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user is the creator" do

      let(:headers) { reader_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user is the not the creator" do

      let(:headers) { another_reader_headers }

      it "has a 403 FORBIDDEN status code" do
        delete path, headers: headers
        expect(response).to have_http_status(403)
      end
    end


  end

end
