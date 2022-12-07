# frozen_string_literal: true

require "rails_helper"

RSpec.describe EntitlementGrantAudit, type: :model do
  let!(:entitlement_target) { FactoryBot.create :user }
  let!(:entitlement_subject) { FactoryBot.create :project }
  let!(:global_roles) { { subscriber: false } }
  let!(:scoped_roles) { { read_access: true } }
  let!(:expires_on) { nil }

  let!(:entitlement_attributes) do
    {
      target: entitlement_target,
      subject: entitlement_subject,
      global_roles: global_roles,
      scoped_roles: scoped_roles,
      expires_on: expires_on
    }
  end

  let(:audit_user) { entitlement_target }
  let(:audit_resource) { entitlement_subject }

  let!(:entitlement) do
    FactoryBot.create :entitlement, entitlement_attributes
  end

  before do
    ManifoldApi::Container["entitlements.sync_static_models"].()

    refresh!
  end

  def refresh!
    ManifoldApi::Container["entitlements.populate_grants"].()

    described_class.refresh!
  end

  def audit_scope_for(user, resource, role_name)
    described_class.where(user: user, resource: resource, role_name: role_name)
  end

  def audit_for(role_name, user: audit_user, resource: audit_resource)
    audit_scope_for(user, resource, role_name).first
  end

  def audit_for!(role_name, user: audit_user, resource: audit_resource)
    audit_scope_for(user, resource, role_name).first!
  end

  context "when everything is as it should be" do
    it "finds a skip action" do
      expect(audit_for!(:read_access)).to be_should_skip
    end
  end

  context "when a role is missing" do
    before do
      audit_user.remove_role :read_access, audit_resource

      refresh!
    end

    it "finds an add_role action" do
      expect(audit_for!(:read_access)).to be_should_add_role
    end
  end

  context "when there is an orphan role" do
    let!(:orphan_user) { FactoryBot.create :user }

    before do
      orphan_user.add_role :read_access, entitlement_subject

      refresh!
    end

    it "finds a remove_role action" do
      expect(audit_for!(:read_access, user: orphan_user)).to be_should_remove_role
    end
  end

  context "when an entitlement has expired" do
    before do
      entitlement.expires_on = Date.current.yesterday
      entitlement.save!

      refresh!
    end

    it "finds a remove_role action" do
      expect(audit_for!(:read_access)).to be_should_remove_role
    end
  end
end
