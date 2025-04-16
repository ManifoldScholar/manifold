# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Permission, type: :model do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }

  it "is invalid without any role names" do
    permission = described_class.new(user: user, resource: project, role_names: [])
    expect(permission).not_to be_valid
  end

  it "is invalid without a user" do
    permission = described_class.new(user: nil, resource: project, role_names: %w[project_editor])
    expect(permission).not_to be_valid
  end

  it "is invalid without a resource" do
    permission = described_class.new(user: user, resource: nil, role_names: %w[project_editor])
    expect(permission).not_to be_valid
  end
end
