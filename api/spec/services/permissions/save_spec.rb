require "rails_helper"

RSpec.describe Permissions::Save do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }
  let(:permission) { Permission.new(user_id: user.id,
                                    resource_id: project.id,
                                    resource_type: project.class.name,
                                    role_names: %w[project_editor project_author])
  }

  it "correctly updates roles" do
    outcome = Permissions::Save.run permission: permission
    expect(outcome.result.role_names).to include "project_editor", "project_author"
  end
end
