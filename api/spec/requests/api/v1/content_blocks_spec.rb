require "swagger_helper"

RSpec.describe "Content Blocks", type: :request do
  path "/content_blocks/{id}" do
    include_examples "an API show request", model: ContentBlock
    include_examples "an API update request", model: ContentBlock, auth_type: :admin
    include_examples "an API destroy request", model: ContentBlock, auth_type: :admin
  end

  describe "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:resource) { FactoryBot.create(:content_block, project: parent) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/content_blocks" do
      include_examples "an API index request",
                        model: ContentBlock,
                        url_parameters: [:project_id],
                        tags: "Project Content Blocks"

      include_examples "an API create request",
                        model: ContentBlock,
                        url_parameters: [:project_id],
                        tags: "Project Content Blocks",
                        auth_type: :admin
    end
  end
end
