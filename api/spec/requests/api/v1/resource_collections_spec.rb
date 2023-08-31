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
                     authorized_user: :admin

    include_examples "an API destroy request",
                     model: ResourceCollection,
                     authorized_user: :admin
  end

  context "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/resource_collections" do
      include_examples "an API create request",
                       parent: "project",
                       model: ResourceCollection,
                       url_parameters: [:project_id],
                       authorized_user: :admin

      include_examples "an API index request",
                       parent: "project",
                       model: ResourceCollection,
                       url_parameters: [:project_id],
                       paginated: true
    end
  end

  context "for a text section" do
    let(:parent) { FactoryBot.create(:text_section) }
    let(:text_section_id) { parent.id }
    let!(:text_id) { parent.text.id }
    let(:annotation) do
      FactoryBot.create(:annotation, text_section_id: text_section_id, resource_id: resource.id)
    end

    path "/texts/{text_id}/relationships/text_sections/{text_section_id}/resource_collections" do
      include_examples "an API index request",
                       parent: "text section",
                       model: ResourceCollection,
                       url_parameters: [:text_section_id, :text_id]
    end
  end
end
