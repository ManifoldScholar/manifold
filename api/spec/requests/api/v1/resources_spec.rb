require "swagger_helper"

RSpec.describe "Resources", type: :request do
  path "/resources/{id}" do
    include_examples "an API show request", model: Resource
    include_examples "an API destroy request", model: Resource, authorized_user: :admin
    include_examples "an API update request", model: Resource, authorized_user: :admin
  end

  context "when relating to a project" do
    let(:project) { FactoryBot.create(:project) }
    let(:resource) { FactoryBot.create(:resource, project: project) }
    let(:project_id) { project.id }

    path "/projects/{project_id}/relationships/resources" do
      include_examples "an API create request",
                       parent: "project",
                       model: Resource,
                       authorized_user: :admin,
                       url_parameters: [:project_id]

      include_examples "an API index request",
                       parent: "project",
                       model: Resource,
                       url_parameters: [:project_id]
    end
  end

  context "when relating to a resource collection" do
    let(:resource_collection) { FactoryBot.create(:resource_collection) }
    let(:resource) { FactoryBot.create(:resource, resource_collection: resource_collection) }
    let(:resource_collection_id) { resource_collection.id }

    path "/resource_collections/{resource_collection_id}/relationships/resources" do
      include_examples "an API index request",
                       parent: "resource collection",
                       model: Resource,
                       url_parameters: [:resource_collection_id]
    end
  end

  context "when relating to a text section" do
    let(:text_section) { FactoryBot.create(:text_section) }
    let(:resource) { FactoryBot.create(:resource, text_section: text_section) }
    let(:text_section_id) { text_section.id }
    let!(:text_id) { text_section.text.id }

    path "/texts/{text_id}/relationships/text_sections/{text_section_id}/resources" do
      include_examples "an API index request",
                       parent: "text section",
                       model: Resource,
                       url_parameters: [:text_section_id, :text_id]
    end
  end
end
