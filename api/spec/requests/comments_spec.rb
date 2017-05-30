require "rails_helper"

RSpec.describe "Comments API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:annotation) { FactoryGirl.create(:annotation) }
  let(:resource) { FactoryGirl.create(:resource) }
  let(:comment_a) { FactoryGirl.create(:comment, creator: reader, subject: annotation) }
  let(:comment_b) { FactoryGirl.create(:comment, creator: reader, subject: resource) }

  context "when subject is an annotation" do
    describe "sends a list of comments" do
      before(:each) { get api_v1_annotation_relationships_comments_path(annotation), headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end

    describe "sends a single comment" do
      let(:path) { api_v1_annotation_relationships_comment_path(annotation, comment_a) }

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

    describe "updates a comment" do
      let(:path) { api_v1_annotation_relationships_comment_path(annotation, comment_a) }

      context "when the user is an admin" do

        let(:headers) { admin_headers }

        describe "the response" do
          context "body" do
            it("contains the updated body") { expect_updated_param("body", "rambo attack") }
          end

          it "has a 200 OK status code" do
            patch path, headers: headers, params: json_payload()
            expect(response).to have_http_status(200)
          end
        end
      end

      context "when the user is the comment creator" do

        let(:headers) { admin_headers }

        describe "the response" do
          context "body" do
            it("contains the updated body") { expect_updated_param("body", "rambo attack") }
          end

          it "has a 200 OK status code" do
            patch path, headers: headers, params: json_payload()
            expect(response).to have_http_status(200)
          end
        end
      end

      context "when the user is neither an admin nor the comment creator" do

        let(:headers) { author_headers }

        describe "the response" do
          it "has a 403 status code" do
            patch path, headers: headers, params: json_payload()
            expect(response).to have_http_status(403)
          end
        end
      end

    end

    describe "creates a comment" do
      let(:path) { api_v1_annotation_relationships_comments_path(annotation, comment_a) }

      let(:params) {
        json_payload(attributes: {
          body: "John Rambo was here.",
        })
      }

      context "when the user is an admin" do
        let(:headers) { admin_headers }
        it("returns a saved comment") do
          post path, headers: headers, params: params
          api_response = JSON.parse(response.body)
          expect(api_response["data"]["id"]).to_not be nil
        end
      end

      context "when the user is a reader" do
        let(:headers) { reader_headers }
        it("returns a saved comment") do
          post path, headers: headers, params: params
          api_response = JSON.parse(response.body)
          expect(api_response["data"]["id"]).to_not be nil
        end
      end
    end
  end


  context "when subject is a resource" do
    describe "sends a list of comments" do
      before(:each) { get api_v1_resource_relationships_comments_path(resource), headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end

    describe "sends a single comment" do
      let(:path) { api_v1_resource_relationships_comment_path(resource, comment_b) }

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

    describe "updates a comment" do
      let(:path) { api_v1_resource_relationships_comment_path(resource, comment_b) }

      context "when the user is an admin" do

        let(:headers) { admin_headers }

        describe "the response" do
          context "body" do
            it("contains the updated body") { expect_updated_param("body", "rambo attack") }
          end

          it "has a 200 OK status code" do
            patch path, headers: headers, params: json_payload()
            expect(response).to have_http_status(200)
          end
        end
      end

      context "when the user is the comment creator" do

        let(:headers) { admin_headers }

        describe "the response" do
          context "body" do
            it("contains the updated body") { expect_updated_param("body", "rambo attack") }
          end

          it "has a 200 OK status code" do
            patch path, headers: headers, params: json_payload()
            expect(response).to have_http_status(200)
          end
        end
      end

      context "when the user is neither an admin nor the comment creator" do

        let(:headers) { author_headers }

        describe "the response" do
          it "has a 403 status code" do
            patch path, headers: headers, params: json_payload()
            expect(response).to have_http_status(403)
          end
        end
      end

    end

    describe "creates a comment" do
      let(:path) { api_v1_resource_relationships_comments_path(resource, comment_b) }

      let(:params) {
        json_payload(attributes: {
          body: "John Rambo was here.",
        })
      }

      context "when the user is an admin" do
        let(:headers) { admin_headers }
        it("returns a saved comment") do
          post path, headers: headers, params: params
          api_response = JSON.parse(response.body)
          expect(api_response["data"]["id"]).to_not be nil
        end
      end

      context "when the user is a reader" do
        let(:headers) { reader_headers }
        it("returns a saved comment") do
          post path, headers: headers, params: params
          api_response = JSON.parse(response.body)
          expect(api_response["data"]["id"]).to_not be nil
        end
      end
    end
  end

end
