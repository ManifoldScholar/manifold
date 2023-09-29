# frozen_string_literal: true

RSpec.describe Entitlements::CreatePendingJob, type: :job do
  let!(:email) { Faker::Internet.unique.email }

  let!(:pending_entitlement) { FactoryBot.create :pending_entitlement, email: email }

  context "when a user has been added" do
    let!(:user) { pending_entitlement && FactoryBot.create(:user, email: email) }

    it "creates the entitlement for the matched user" do
      expect do
        described_class.perform_now pending_entitlement
      end.to change { pending_entitlement.current_state(force_reload: true) }.from("pending").to("success")
        .and(change(Entitlement, :count).by(1))
    end
  end

  context "when there is no user yet" do
    it "creates no entitlement, remains pending" do
      expect do
        described_class.perform_now pending_entitlement
      end.to keep_the_same { pending_entitlement.current_state(force_reload: true) }
        .and(keep_the_same(Entitlement, :count))
    end
  end
end
