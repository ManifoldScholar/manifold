# frozen_string_literal: true

RSpec.describe "Text Section Annotations API", type: :request do
  let_it_be(:creator, refind: true) { FactoryBot.create(:user) }
  let_it_be(:project, refind: true) { FactoryBot.create(:project, creator: creator) }
  let_it_be(:text, refind: true) { FactoryBot.create(:text, project: project, creator: creator) }
  let_it_be(:text_section) { FactoryBot.create(:text_section, text: text) }
  let_it_be(:resource, refind: true) { FactoryBot.create(:resource, creator: creator, project: project) }
  let_it_be(:collection, refind: true) { FactoryBot.create(:resource_collection, project: project) }

  let(:resource_params) do
    {
      attributes: FactoryBot.attributes_for(:resource_annotation, resource: resource, creator: creator),
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
      attributes: FactoryBot.attributes_for(:collection_annotation, collection: collection, creator: creator),
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

  let(:path) { api_v1_text_relationships_text_section_annotations_path(text_id: text.id, text_section_id: text_section) }

  describe "access to public annotations" do
    let_it_be(:my_public_reading_group) { FactoryBot.create(:reading_group, privacy: "public") }
    let_it_be(:my_private_reading_group) { FactoryBot.create(:reading_group, privacy: "private") }
    let_it_be(:my_public_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_public_reading_group, user: reader) }
    let_it_be(:my_private_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_private_reading_group, user: reader) }
    let_it_be(:other_reader_in_my_public_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_public_reading_group, user: another_reader) }
    let_it_be(:other_reader_in_my_private_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: my_private_reading_group, user: another_reader) }

    let_it_be(:other_public_reading_group) { FactoryBot.create(:reading_group, privacy: "public") }
    let_it_be(:other_private_reading_group) { FactoryBot.create(:reading_group, privacy: "private") }
    let_it_be(:reader_in_other_public_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: other_public_reading_group, user: another_reader) }
    let_it_be(:reader_in_other_private_reading_group_membership) { FactoryBot.create(:reading_group_membership, reading_group: other_private_reading_group, user: another_reader) }

    # Always Visible
    let_it_be(:my_private_annotation) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, private: true) }
    let_it_be(:my_public_annotation) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, private: false) }
    let_it_be(:my_annotation_in_my_public_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, reading_group: my_public_reading_group) }
    let_it_be(:my_annotation_in_my_private_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: reader, reading_group: my_private_reading_group) }

    # Always Hidden
    let_it_be(:other_private_annotation) { FactoryBot.create(:annotation, text_section: text_section, private: true) }
    let_it_be(:other_reader_annotation_in_other_private_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: other_private_reading_group) }

    # Sometimes Visible
    let_it_be(:other_public_annotation) { FactoryBot.create(:annotation, text_section: text_section, private: false) }
    let_it_be(:other_reader_annotation_in_my_private_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: my_private_reading_group) }
    let_it_be(:other_reader_annotation_in_my_public_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: my_public_reading_group) }
    let_it_be(:other_reader_annotation_in_other_public_reading_group) { FactoryBot.create(:annotation, text_section: text_section, creator: another_reader, reading_group: other_public_reading_group) }

    let(:api_response) { JSON.parse(response.body) }
    let(:included_ids) { api_response["data"].pluck("id") }
    let(:path) { api_v1_text_relationships_text_section_annotations_path(text_id: text.id, text_section_id: text_section) }

    always_included = %w(my_private_annotation my_public_annotation my_annotation_in_my_public_reading_group my_annotation_in_my_private_reading_group)
    always_excluded = %w(other_private_annotation other_reader_annotation_in_other_private_reading_group)

    def make_the_request!
      expect do
        get path, headers: reader_headers
      end.to execute_safely
    end

    context "when the project has disabled engagement, visible annotations" do
      before do
        project.update! disable_engagement: true
      end

      included_annotations = always_included + %w(other_reader_annotation_in_my_private_reading_group other_reader_annotation_in_my_public_reading_group)
      excluded_annotations = always_excluded + %w(other_public_annotation other_reader_annotation_in_other_public_reading_group)

      included_annotations.each do |annotation|
        it "includes #{annotation}" do
          make_the_request!

          expect(included_ids).to include(send(annotation).id)
        end
      end

      excluded_annotations.each do |annotation|
        it "excludes #{annotation}" do
          make_the_request!

          expect(included_ids).to_not include(send(annotation).id)
        end
      end
    end

    context "when the project has allowed engagement in the collection, visible annotations" do
      before do
        project.update! disable_engagement: false
      end

      included_annotations = always_included + %w(other_public_annotation other_reader_annotation_in_my_private_reading_group other_reader_annotation_in_my_public_reading_group other_reader_annotation_in_other_public_reading_group)
      excluded_annotations = always_excluded

      included_annotations.each do |annotation|
        it "includes #{annotation}" do
          make_the_request!

          expect(included_ids).to include(send(annotation).id)
        end
      end

      excluded_annotations.each do |annotation|
        it "excludes #{annotation}" do
          make_the_request!

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

  context "when creating an annotation" do
    let(:annotation_privacy) { :is_public }

    let(:annotation_params) do
      {
        attributes: FactoryBot.attributes_for(:annotation, annotation_privacy, creator: creator, text_section: text_section),
      }
    end

    let(:path) { api_v1_text_section_relationships_annotations_path(text_section_id: text_section.id) }

    let(:params) do
      build_json_payload(annotation_params)
    end

    context "when the user is a reader" do
      it "has a 201 status code" do
        expect do
          post path, headers: reader_headers, params: params
        end.to change(Annotation, :count).by(1)

        expect(response).to have_http_status(201)
      end

      it "is rate-limited" do
        expect do
          7.times do
            post path, headers: reader_headers, params: params
          end
        end.to change(Annotation, :count).by(5)
          .and change(ThrottledRequest, :count).by(1)

        expect(response).to have_http_status(503)
      end

      context "when the user has not confirmed their email" do
        before do
          reader.clear_email_confirmation!
        end

        it "does not create a public annotation" do
          expect do
            post path, headers: reader_headers, params: params
          end.to keep_the_same(Annotation, :count)

          expect(response).to have_http_status(:forbidden)
        end
      end

      context "with spam detection enabled" do
        before do
          akismet_enabled!
          akismet_stub_comment_check!(situation: :spam)
        end

        context "when the annotation is private" do
          let(:annotation_privacy) { :is_private }

          it "gets created anyway" do
            expect do
              post path, headers: admin_headers, params: params
            end.to change(Annotation, :count).by(1)

            expect(response).to have_http_status(:created)
          end
        end

        context "when the annotation is public" do
          let(:annotation_privacy) { :is_public }

          it "does not create the annotation" do
            expect do
              post path, headers: reader_headers, params: params
            end.to keep_the_same(Annotation, :count)

            expect(response).to have_http_status(:unprocessable_entity)
          end
        end
      end
    end

    context "when the user is not authenticated" do
      it "is not authorized to create an annotation" do
        expect do
          post path, params: params
        end.to keep_the_same(Annotation, :count)

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when the user is an admin" do
      it "creates the annotation" do
        expect do
          post path, headers: admin_headers, params: params
        end.to change(Annotation, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      context "with spam detection enabled" do
        before do
          akismet_enabled!
          akismet_stub_comment_check!(situation: :spam)
        end

        context "when the annotation is public" do
          let(:annotation_privacy) { :is_public }

          it "gets created anyway" do
            expect do
              post path, headers: admin_headers, params: params
            end.to change(Annotation, :count).by(1)

            expect(response).to have_http_status(:created)
          end
        end
      end
    end
  end

  describe "creates a resource annotation" do
    let(:path) { api_v1_text_section_relationships_annotations_path(text_section_id: text_section.id) }

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
    let(:path) { api_v1_text_section_relationships_annotations_path(text_section_id: text_section.id) }

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
