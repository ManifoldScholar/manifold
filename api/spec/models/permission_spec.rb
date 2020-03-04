require 'rails_helper'

RSpec.describe Permission, type: :model do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }

  it "is invalid without any role names" do
    permission = Permission.new(user: user, resource: project, role_names: [])
    expect(permission).to_not be_valid
  end

  it "is invalid without a user" do
    permission = Permission.new(user: nil, resource: project, role_names: %w[project_editor])
    expect(permission).to_not be_valid
  end

  it "is invalid without a resource" do
    permission = Permission.new(user: user, resource: nil, role_names: %w[project_editor])
    expect(permission).to_not be_valid
  end
end
