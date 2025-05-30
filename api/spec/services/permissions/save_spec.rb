# frozen_string_literal: true

require "rails_helper"

RSpec.describe Permissions::Save do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }
  let(:permission) do
    Permission.new(user_id: user.id,
                                    resource_id: project.id,
                                    resource_type: project.class.name,
                                    role_names: %w[project_editor project_author])
  end

  it "correctly updates roles" do
    outcome = described_class.run permission: permission
    expect(outcome.result.role_names).to include "project_editor", "project_author"
  end
end
