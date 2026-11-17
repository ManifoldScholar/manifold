# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserGroupEntitleable, type: :model do
  let(:project) { FactoryBot.create(:project) }
  let(:user) { FactoryBot.create(:user) }

  let!(:user_group) { FactoryBot.create(:user_group) }

  let(:user_group_entitleable) { FactoryBot.create(:user_group_entitleable, user_group:, entitleable: project) }
  let(:user_group_membership) { FactoryBot.create(:user_group_membership, user_group:, user:) }

  it "creates entitlements for members when an entitleable is added" do
    user_group_membership

    expect do
      user_group_entitleable
    end.to change(Entitlement, :count).by(1)
  end

  it "destroys entitlements upon its destruction" do
    user_group_membership
    user_group_entitleable

    expect { user_group_entitleable.destroy }.to change(Entitlement, :count).by(-1)
  end

  context "with an expiration" do
    let(:expires_on) { Date.current + 30 }

    let(:user_group_entitleable) do
      FactoryBot.create(:user_group_entitleable, user_group:, entitleable: project, expiration: expires_on.to_s)
    end

    it "parses the expiration into expires_on" do
      expect(user_group_entitleable.expires_on).to eq expires_on
    end

    it "propagates the expiration to member entitlements" do
      user_group_membership

      expect { user_group_entitleable }.to change(Entitlement, :count).by(1)
      expect(Entitlement.last.expires_on).to eq expires_on
    end

    it "updates member entitlements when the expiration changes" do
      user_group_membership
      user_group_entitleable

      expect { user_group_entitleable.update!(expiration: (expires_on + 30).to_s) }
        .to change { Entitlement.last.reload.expires_on }.from(expires_on).to(expires_on + 30)
    end

    it "clears member entitlement expirations when the expiration is removed" do
      user_group_membership
      user_group_entitleable

      expect { user_group_entitleable.update!(expiration: nil) }
        .to change { Entitlement.last.reload.expires_on }.from(expires_on).to(nil)
    end

    it "rejects an expiration in the past" do
      entitleable = FactoryBot.build(
        :user_group_entitleable, user_group:, entitleable: project, expiration: (Date.current - 1).to_s
      )

      expect(entitleable).not_to be_valid
      expect(entitleable.errors[:expiration]).to be_present
    end
  end
end
