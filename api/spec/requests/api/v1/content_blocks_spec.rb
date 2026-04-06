# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Content Blocks", type: :request do
  path "/content_blocks/{id}" do
    it_behaves_like "an API show request", model: ContentBlock
    it_behaves_like "an API update request", model: ContentBlock, authorized_user: :admin
    it_behaves_like "an API destroy request", model: ContentBlock, authorized_user: :admin
  end

  describe "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:resource) { FactoryBot.create(:content_block, project: parent) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/content_blocks" do
      it_behaves_like "an API index request",
                       parent: "project",
                       model: ContentBlock,
                       url_parameters: [:project_id]

      it_behaves_like "an API create request",
                       parent: "project",
                       model: ContentBlock,
                       url_parameters: [:project_id],
                       authorized_user: :admin
    end
  end
end
