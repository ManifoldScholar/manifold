# frozen_string_literal: true

require "rails_helper"

RSpec.describe EntitlementAssignedRole, type: :model do
  before do
    ManifoldApi::Container["entitlements.sync_static_models"].()
  end

  let!(:project) { FactoryBot.create(:project, draft: false) }
  let!(:project_entitlement) { FactoryBot.create :entitlement, :read_access, :for_user, subject: project }
  let!(:subscription_entitlement) { FactoryBot.create :entitlement, :global_subscriber, :for_user }

  def assigned_roles_for(entitlement)
    params = {
      user_id:  entitlement.user_ids,
      resource: entitlement.subject,
      role_name: entitlement.granted_role_names.map(&:to_s)
    }

    described_class.where(params)
  end

  it "finds the roles" do
    aggregate_failures do
      expect(assigned_roles_for(project_entitlement)).to be_present
      expect(assigned_roles_for(subscription_entitlement)).to be_present
    end
  end
end
