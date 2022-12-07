# frozen_string_literal: true

require "rails_helper"

RSpec.describe EntitlementGrant, type: :model do
  before do
    ManifoldApi::Container["entitlements.sync_static_models"].()
  end

  context "with a mix of entitlement sources" do
    let!(:user) { FactoryBot.create :user }
    let!(:project) { FactoryBot.create :project }
    let!(:collection_project) { FactoryBot.create :collection_project, project: project }
    let!(:project_collection) { collection_project.project_collection }

    let!(:active_entitlement) { shared_entitlement_for project }
    let!(:collection_entitlement) { shared_entitlement_for project_collection}
    let!(:expired_entitlement) { shared_entitlement_for project, expires_on: Date.current - 7 }

    let!(:everything) do
      [user, project, project_collection, active_entitlement, collection_entitlement, expired_entitlement]
    end

    let!(:grant) do
      everything

      ManifoldApi::Container["entitlements.populate_grants"].()

      EntitlementGrant.where(user: user, resource: project).first!
    end

    subject { grant }

    def shared_entitlement_for(subject, **attributes)
      attributes[:user] = user
      attributes[:subject] = subject
      attributes[:scoped_roles] = { read_access: true }

      FactoryBot.create :entitlement, :for_user, attributes
    end

    it { is_expected.to have_ever_been_expired }

    it { is_expected.to have_ever_been_inferred }

    it { is_expected.not_to be_expired }

    it { is_expected.to have(3).summaries }
  end
end
