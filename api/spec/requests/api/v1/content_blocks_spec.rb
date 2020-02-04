require "swagger_helper"

RSpec.describe "Content Blocks", type: :request do
  path "/content_blocks/{id}" do
    include_examples "an API show request", model: ContentBlock
    include_examples "an API update request", model: ContentBlock, authorized_user: :admin
    include_examples "an API destroy request", model: ContentBlock, authorized_user: :admin
  end

  describe "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:resource) { FactoryBot.create(:content_block, project: parent) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/content_blocks" do
      include_examples "an API index request",
                       parent: "project",
                       model: ContentBlock,
                       url_parameters: [:project_id]

      include_examples "an API create request",
                       parent: "project",
                       model: ContentBlock,
                       url_parameters: [:project_id],
                       authorized_user: :admin
    end
  end
end
