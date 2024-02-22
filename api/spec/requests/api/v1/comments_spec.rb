# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Comments", type: :request do
  context "for an annotation" do
    let_it_be(:parent, refind: true) { FactoryBot.create(:annotation) }
    let_it_be(:resource, refind: true) { FactoryBot.create(:comment, subject: parent) }
    let_it_be(:annotation_id) { parent.id }

    path "/annotations/{annotation_id}/relationships/comments/{id}" do
      include_examples "an API show request", parent: "annotation", model: Comment, url_parameters: [:annotation_id]
      include_examples "an API update request", parent: "annotation", model: Comment, url_parameters: [:annotation_id], authorized_user: :admin
      include_examples "an API destroy request", parent: "annotation", model: Comment, url_parameters: [:annotation_id], authorized_user: :admin
    end

    path "/annotations/{annotation_id}/relationships/comments" do
      it_behaves_like "an API create request", parent: "annotation", model: Comment, url_parameters: [:annotation_id], authorized_user: :admin, included_relationships: [:creator]
      include_examples "an API index request", parent: "annotation", model: Comment, url_parameters: [:annotation_id], paginated: true, included_relationships: [:creator]
    end
  end

  context "for a resource" do
    let_it_be(:parent, refind: true) { FactoryBot.create(:resource) }
    let_it_be(:resource, refind: true) { FactoryBot.create(:comment, subject: parent) }
    let_it_be(:resource_id) { parent.id }

    path "/resources/{resource_id}/relationships/comments/{id}" do
      include_examples "an API show request", parent: "resource", model: Comment, url_parameters: [:resource_id]
      include_examples "an API update request", parent: "resource", model: Comment, url_parameters: [:resource_id], authorized_user: :admin
      include_examples "an API destroy request", parent: "resource", model: Comment, url_parameters: [:resource_id], authorized_user: :admin
    end

    path "/resources/{resource_id}/relationships/comments" do
      it_behaves_like "an API create request", parent: "resource", model: Comment, url_parameters: [:resource_id], authorized_user: :admin, included_relationships: [:creator]
    end
  end

  path "/comments/{id}" do
    include_examples "an API show request", model: Comment
    include_examples "an API update request", model: Comment, authorized_user: :admin
    include_examples "an API destroy request", model: Comment, authorized_user: :admin
  end

  describe "when taking the form of a flag" do
    context "when attached to a comment" do
      let_it_be(:comment, refind: true) { FactoryBot.create(:comment, creator: admin) }
      let_it_be(:comment_id) { comment.id }
      let_it_be(:flag, refind: true) { FactoryBot.create(:flag, flaggable: comment, creator: admin) }

      path "/comments/{comment_id}/relationships/flags" do
        include_examples "an API create request",
                         summary: "Flag the comment for moderation",
                         model: Comment,
                         authorized_user: :admin,
                         request_body: false,
                         url_parameters: [:comment_id]

        include_examples "an API destroy request",
                         summary: "Unflag the comment",
                         model: Comment,
                         authorized_user: :admin,
                         url_parameters: [:comment_id],
                         # this route is a special case where a destroy does not take an ID
                         parameters: [],
                         exclude: %w(404),
                         delete_has_response_body: true,
                         success_response_code: "200"
      end
    end
  end
end
