# frozen_string_literal: true

require "rails_helper"

RSpec.describe Permissions::Destroy do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }
  let(:permission) do
    Permission.new(user_id: user.id,
                                    resource_id: project.id,
                                    resource_type: project.class.name,
                                    role_names: %w[project_author])
  end

  it "correctly removes roles" do
    user.add_role "project_author", project
    described_class.run permission: permission
    expect(user.roles).not_to include "project_editor", "project_author"
  end
end
