require "swagger_helper"

RSpec.describe "Text", type: :request do
  path "/texts" do
    include_examples "an API index request",
                      model: Text,
                      included_relationships: [:project]
  end
  path "/texts/{id}" do
    include_examples "an API show request",
                      model: Text,
                      included_relationships: [
                        :project,
                        :category,
                        :creators,
                        :contributors,
                        :stylesheets
                      ]

    include_examples "an API update request",
                      model: Text,
                      authorized_user: :admin,
                      included_relationships: [
                        :project,
                        :creators,
                        :contributors
                      ]

    include_examples "an API destroy request",
                      model: Text,
                      authorized_user: :admin
  end

  let!(:project) { FactoryBot.create(:project) }
  let(:project_id) { project.id }

  path "/projects/{project_id}/relationships/texts" do
    include_examples "an API create request",
                    model: Text,
                    parent: "project",
                    url_parameters: [:project_id],
                    authorized_user: :admin
  end

end
