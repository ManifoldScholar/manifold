require "swagger_helper"

RSpec.describe "Action Callouts", type: :request do
  conditional_requirements = <<~HEREDOC.freeze
    Requirements:
    * Requires text relationship if type is read or toc
    * Requires url if type is link
  HEREDOC

  path "/action_callouts/{id}" do
    include_examples "an API show request", model: ActionCallout
    include_examples "an API update request",
                     model: ActionCallout,
                     authorized_user: :admin,
                     description: conditional_requirements

    include_examples "an API destroy request", model: ActionCallout, authorized_user: :admin
  end

  context "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/action_callouts" do
      include_examples "an API index request",
                       parent: "project",
                       model: ActionCallout,
                       url_parameters: [:project_id]

      include_examples "an API create request",
                       parent: "project",
                       model: ActionCallout,
                       authorized_user: :admin,
                       url_parameters: [:project_id],
                       description: conditional_requirements
    end
  end
end
