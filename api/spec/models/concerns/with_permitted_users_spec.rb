require "rails_helper"

RSpec.describe WithPermittedUsers do
  let(:user) { FactoryBot.create(:user, :project_creator) }

  it "assigns the creator a project_editor role" do
    project = FactoryBot.create(:project, creator: user)

    expect(user).to have_role :project_editor, project
  end
end
