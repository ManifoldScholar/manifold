require 'rails_helper'

RSpec.describe Permission, type: :model do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }

  it "is invalid without any role names" do
    permission = Permission.new(user: user, resource: project, role_names: [])
    expect(permission).to_not be_valid
  end

  it "is invalid without a user" do
    permission = Permission.new(user: nil, resource: project, role_names: ["owner"])
    expect(permission).to_not be_valid
  end

  it "is invalid without a resource" do
    permission = Permission.new(user: user, resource: nil, role_names: ["owner"])
    expect(permission).to_not be_valid
  end

  it "is invalid when user is not an editor" do
    permission = Permission.new(user: user, resource: project, role_names: ["owner"])
    expect(permission).to_not be_valid
  end

  it "is invalid when user is an editor" do
    editor = FactoryBot.create(:user, role: Role::ROLE_EDITOR)
    permission = Permission.new(user: editor, resource: project, role_names: ["owner"])
    expect(permission).to be_valid
  end

end
