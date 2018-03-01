require "rails_helper"

RSpec.describe WithPermittedUsers do
  let(:user) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }

  it "assigns the creator a project_editor role" do
    project = FactoryBot.create(:project, creator: user)
    expect(user).to have_role Role::ROLE_PROJECT_EDITOR, project
  end
end
