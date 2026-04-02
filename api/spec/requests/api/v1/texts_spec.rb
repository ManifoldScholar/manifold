# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Text", type: :request do
  path "/texts" do
    it_behaves_like "an API index request",
                      model: Text,
                      included_relationships: [:project]
  end
  path "/texts/{id}" do
    it_behaves_like "an API show request",
                      model: Text,
                      included_relationships: [
                        :project,
                        :category,
                        :creators,
                        :contributors,
                        :stylesheets
                      ]

    it_behaves_like "an API update request",
                      model: Text,
                      authorized_user: :admin,
                      included_relationships: [
                        :project,
                        :creators,
                        :contributors
                      ]

    it_behaves_like "an API destroy request",
                      model: Text,
                      authorized_user: :admin
  end

  let!(:project) { FactoryBot.create(:project) }
  let(:project_id) { project.id }

  path "/projects/{project_id}/relationships/texts" do
    it_behaves_like "an API create request",
                    model: Text,
                    parent: "project",
                    url_parameters: [:project_id],
                    authorized_user: :admin
  end
end
