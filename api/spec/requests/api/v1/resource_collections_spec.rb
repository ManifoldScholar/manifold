require "swagger_helper"

RSpec.describe "Resource Collections", type: :request do

  let(:resource) { FactoryBot.create(:resource_collection) }
  included_relationships = [:project, :resource]

  path "/resource_collections/{id}" do
    include_examples "an API show request",
                      model: ResourceCollection,
                      included_relationships: included_relationships

    include_examples "an API update request",
                      model: ResourceCollection,
                      included_relationships: included_relationships,
                      auth_type: :admin

    include_examples "an API destroy request",
                      model: ResourceCollection,
                      auth_type: :admin
  end

  context "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/resource_collections" do
      include_examples "an API create request",
                        model: ResourceCollection,
                        tags: "Projects",
                        url_parameters: [:project_id],
                        auth_type: :admin

      include_examples "an API index request",
                        model: ResourceCollection,
                        tags: "Projects",
                        url_parameters: [:project_id],
                        paginated: true
    end
  end

  context "for a text section" do
    let(:parent) { FactoryBot.create(:text_section) }
    let(:text_section_id) { parent.id }
    let(:annotation) {
      FactoryBot.create(:annotation, text_section_id: text_section_id, resource_id: resource.id)
    }

    path "/text_sections/{text_section_id}/relationships/resource_collections" do
      include_examples "an API index request",
                        model: ResourceCollection,
                        tags: "Text Sections",
                        url_parameters: [:text_section_id]
    end
  end
end
