require "rails_helper"

RSpec.describe "Text Section Annotations API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:project) { FactoryBot.create(:project) }
  let(:text) { FactoryBot.create(:text, project: project) }
  let(:text_section) { FactoryBot.create(:text_section, text: text) }
  let(:resource) { FactoryBot.create(:resource, project: text_section.project) }
  let(:collection) { FactoryBot.create(:resource_collection, project: text_section.project) }
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
        resource_collection: {
          data: {
            type: "resource_collections",
            id: collection.id
          }
        }
      }
    }
  end
  let(:path) { api_v1_text_section_relationships_annotations_path(text_section) }

  describe "access to public annotations" do
    let!(:my_public_reading_group) { FactoryBot.create(:reading_group, privacy: "public") }
    let!(:my_private_reading_group) { FactoryBot.create(:reading_group, privacy: "private") }
    let!(:my_public_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_public_reading_group, user: reader) }
    let!(:my_private_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_private_reading_group, user: reader) }
    let!(:other_reader_in_my_public_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_public_reading_group, user: another_reader) }
    let!(:other_reader_in_my_private_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_private_reading_group, user: another_reader) }

    let!(:other_public_reading_group) { FactoryBot.create(:reading_group, privacy: "public") }
    let!(:other_private_reading_group) { FactoryBot.create(:reading_group, privacy: "private") }
    let!(:reader_in_other_public_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: other_public_reading_group, user: another_reader) }
    let!(:reader_in_other_private_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: other_private_reading_group, user: another_reader) }

    # Always Visible
    let!(:my_private_annotation) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, private: true) }
    let!(:my_public_annotation) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, private: false) }
    let!(:my_annotation_in_my_public_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, reading_group: my_public_reading_group) }
    let!(:my_annotation_in_my_private_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, reading_group: my_private_reading_group) }

    # Always Hidden
    let!(:other_private_annotation) { FactoryBot.create(:annotation, text_section: text_section, private: true) }
    let!(:other_reader_annotation_in_other_private_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: other_private_reading_group) }

    # Sometimes Visible
    let!(:other_public_annotation) { FactoryBot.create(:annotation, text_section: text_section, private: false) }
    let!(:other_reader_annotation_in_my_private_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: my_private_reading_group) }
    let!(:other_reader_annotation_in_my_public_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: my_public_reading_group) }
    let!(:other_reader_annotation_in_other_public_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: other_public_reading_group) }

    let(:api_response) { JSON.parse(response.body) }
    let(:included_ids) { api_response["data"].map { |a| a["id"] } }
    let(:path) { api_v1_text_section_relationships_annotations_path(text_section) }
    before(:each) { get path, headers: reader_headers }

    always_included = %w(my_private_annotation my_public_annotation my_annotation_in_my_public_reading_group my_annotation_in_my_private_reading_group)
    always_excluded = %w(other_private_annotation other_reader_annotation_in_other_private_reading_group)

    context "when the project has disabled engagement, visible annotations" do
      let(:project) { FactoryBot.create(:project, disable_engagement: true) }

      included_annotations = always_included + %w(other_reader_annotation_in_my_private_reading_group other_reader_annotation_in_my_public_reading_group)
      excluded_annotations = always_excluded + %w(other_public_annotation other_reader_annotation_in_other_public_reading_group)

      included_annotations.each do |annotation|
        it "includes #{annotation}" do
          expect(included_ids).to include(send(annotation).id)
        end
      end
      excluded_annotations.each do |annotation|
        it "excludes #{annotation}" do
          expect(included_ids).to_not include(send(annotation).id)
        end
      end
    end

    context "when the project has allowed engagement in the collection, visible annotations" do
      let(:project) { FactoryBot.create(:project, disable_engagement: false) }

      included_annotations = always_included + %w(other_public_annotation other_reader_annotation_in_my_private_reading_group other_reader_annotation_in_my_public_reading_group other_reader_annotation_in_other_public_reading_group)
      excluded_annotations = always_excluded + %w()

      included_annotations.each do |annotation|
        it "includes #{annotation}" do
          expect(included_ids).to include(send(annotation).id)
        end
      end

      excluded_annotations.each do |annotation|
        it "excludes #{annotation}" do
          expect(included_ids).to_not include(send(annotation).id)
        end
      end
    end
  end

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
      before(:each) { post path, headers: reader_headers, params: build_json_payload(annotation_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is not authenticated" do
      before(:each) { post path, params: build_json_payload(annotation_params) }
      describe "the response" do
        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { post path, headers: admin_headers, params: build_json_payload(annotation_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end
  end

  describe "creates a resource annotation" do
    context "when the user is an reader" do
      before(:each) { post path, headers: reader_headers, params: build_json_payload(resource_params) }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          a = response.body
          expect(response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { post path, headers: admin_headers, params: build_json_payload(resource_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end
  end

  describe "creates a collection annotation" do
    context "when the user is an reader" do
      before(:each) { post path, headers: reader_headers, params: build_json_payload(collection_params) }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          a = response.body
          expect(response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { post path, headers: admin_headers, params: build_json_payload(collection_params) }
      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end
      end
    end
  end
end
