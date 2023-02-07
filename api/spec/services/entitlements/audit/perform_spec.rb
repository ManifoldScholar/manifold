require "rails_helper"

RSpec.describe Entitlements::Audit::Perform do
  let!(:project) { FactoryBot.create :project, { draft: false } }
  let!(:project_entitlement) { FactoryBot.create :entitlement, :for_user, :read_access, subject: project }
  let!(:project_user) { project_entitlement.target }
  let!(:entitled_project) { project_entitlement.subject }

  let!(:subscriber_entitlement) { FactoryBot.create :entitlement, :for_user, :global_subscriber }
  let!(:subscription) { subscriber_entitlement.subject }
  let!(:subscriber_user) { subscriber_entitlement.target }

  let!(:orphan_project) { FactoryBot.create :project }
  let!(:orphan_user) { FactoryBot.create :user }

  let!(:orphan_subscriber) { FactoryBot.create :user }

  before(:each) do
    [project_user, subscriber_user].each do |user|
      2.times do
        user.roles.each do |role|
          user.remove_role role.name.to_s, role.resource
        end

        user.reload
      end
    end

    orphan_user.add_role :read_access, orphan_project

    orphan_subscriber.add_role :subscriber, subscription
  end

  def have_changed_role(user, role, resource, from:, to:)
    change { user.reload.has_role?(role, resource) }.from(from).to(to)
  end

  def have_added_role(user, role, resource)
    have_changed_role(user, role.to_s, resource, from: false, to: true)
  end

  def have_fixed(entitlement)
    user = entitlement.target
    resource = entitlement.subject

    entitlement.granted_role_names.map do |role|
      have_added_role(user, role, resource)
    end.reduce(&:and)
  end

  def have_removed_role(user, role, resource)
    have_changed_role(user, role, resource, from: true, to: false)
  end

  it "will fix everything" do
    expect do
      @result = described_class.new.call
    end.to(
      have_fixed(project_entitlement).
      and(have_fixed(subscriber_entitlement)).
      and(have_removed_role(orphan_user, :read_access, orphan_project)).
      and(have_removed_role(orphan_subscriber, :subscriber, subscription))
    )
  end
end
