require "rails_helper"

RSpec.describe "Text Section Annotations API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:text_section) { FactoryBot.create(:text_section) }
  let(:resource) { FactoryBot.create(:resource, project: text_section.project) }
  let(:collection) { FactoryBot.create(:collection, project: text_section.project) }
  let(:annotation_params) { { attributes: FactoryBot.attributes_for(:annotation) } }
  let(:resource_params) do
    {
      attributes: FactoryBot.build(:resource_annotation).attributes,
      relationships: {
        resource: {
          data: {
            type: "resources",
            id: resource.id
          }
        }
      }
    }
  end
  let(:collection_params) do
    {
      attributes: FactoryBot.build(:collection_annotation).attributes,
      relationships: {
        collection: {
          data: {
            type: "collections",
            id: collection.id
          }
        }
      }
    }
  end
  let(:path) { api_v1_text_section_relationships_annotations_path(text_section) }

  describe "responds with a list of annotations" do
    before(:each) { get path, headers: reader_headers }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "destroys an annotation" do
    let(:annotation) { FactoryBot.create(:annotation, creator: reader) }
    let(:path) { api_v1_annotation_path(annotation) }
    context "when the user is the author of the annotation" do
      describe "the response" do
        it "has a 204 NO CONTENT status code" do
          delete path, headers: reader_headers
          expect(response).to have_http_status(204)
        end
      end
    end
    context "when the user is not the author of the annotation" do
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          annotation = FactoryBot.create(:annotation, creator: author)
          delete api_v1_annotation_path(annotation), headers: reader_headers
          expect(response).to have_http_status(403)
        end
      end
    end
    context "when the user is an admin" do
      describe "the response" do
        it "has a 204 NO CONTENT status code" do
          delete path, headers: admin_headers
          expect(response).to have_http_status(204)
        end
      end
    end
  end

  describe "creates an annotation" do
    context "when the user is an reader" do
      before(:each) { post path, headers: reader_headers, params: json_payload(annotation_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { post path, headers: admin_headers, params: json_payload(annotation_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end
  end

  describe "creates a resource annotation" do
    context "when the user is an reader" do
      before(:each) { post path, headers: reader_headers, params: json_payload(resource_params) }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          a = response.body
          expect(response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { post path, headers: admin_headers, params: json_payload(resource_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end
  end

  describe "creates a collection annotation" do
    context "when the user is an reader" do
      before(:each) { post path, headers: reader_headers, params: json_payload(collection_params) }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          a = response.body
          expect(response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { post path, headers: admin_headers, params: json_payload(collection_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end
  end
end
