require "swagger_helper"

RSpec.describe "Comments", type: :request do
  context "for an annotation" do
    let(:parent) { FactoryBot.create(:annotation) }
    let(:resource) { FactoryBot.create(:comment, subject: parent) }
    let(:annotation_id) { parent.id }

    path "/annotations/{annotation_id}/relationships/comments/{id}" do
      include_examples "an API show request", model: Comment, tags: "Annotation Comments", url_parameters: [:annotation_id]
      include_examples "an API update request", model: Comment, tags: "Annotation Comments", url_parameters: [:annotation_id], authorized_user: :admin
      include_examples "an API destroy request", model: Comment, tags: "Annotation Comments", url_parameters: [:annotation_id], authorized_user: :admin
    end

    path "/annotations/{annotation_id}/relationships/comments" do
      it_behaves_like "an API create request", model: Comment, tags: "Annotation Comments", url_parameters: [:annotation_id], authorized_user: :admin, included_relationships: [:creator]
      include_examples "an API index request", model: Comment, tags: "Annotation Comments", url_parameters: [:annotation_id], paginated: true, included_relationships: [:creator]
    end
  end

  context "for a resource" do
    let(:parent) { FactoryBot.create(:resource) }
    let(:resource) { FactoryBot.create(:comment, subject: parent) }
    let(:resource_id) { parent.id }

    path "/resources/{resource_id}/relationships/comments/{id}" do
      include_examples "an API show request", model: Comment, tags: "Resource Comments", url_parameters: [:resource_id]
      include_examples "an API update request", model: Comment, tags: "Resource Comments", url_parameters: [:resource_id], authorized_user: :admin
      include_examples "an API destroy request", model: Comment, tags: "Resource Comments", url_parameters: [:resource_id], authorized_user: :admin
    end

    path "/resources/{resource_id}/relationships/comments" do
      it_behaves_like "an API create request", model: Comment, tags: "Resource Comments", url_parameters: [:resource_id], authorized_user: :admin, included_relationships: [:creator]
    end
  end

  path "/comments/{id}" do
    include_examples "an API show request", model: Comment
    include_examples "an API update request", model: Comment, authorized_user: :admin
    include_examples "an API destroy request", model: Comment, authorized_user: :admin
  end
end
