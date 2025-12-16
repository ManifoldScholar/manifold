# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserGroupMembership, type: :model do
  let(:project) { FactoryBot.create(:project) }
  let(:user) { FactoryBot.create(:user) }
  let(:user_group) { FactoryBot.create(:user_group) }
  let!(:user_group_entitleable) { FactoryBot.create(:user_group_entitleable, user_group:, entitleable: project) }

  let(:user_group_membership) { FactoryBot.create(:user_group_membership, user_group:, user:) }

  it "creates entitlements for the user upon creation" do
    expect do
      user_group_membership
    end.to change(Entitlement, :count).by(1)
  end

  it "destroys entitlements upon its destruction" do
    user_group_membership

    expect { user_group_membership.destroy }.to change(Entitlement, :count).by(1)
  end
end
