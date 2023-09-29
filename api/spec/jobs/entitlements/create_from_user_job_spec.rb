# frozen_string_literal: true

RSpec.describe Entitlements::CreateFromUserJob, type: :job do
  let!(:email) { Faker::Internet.unique.email }

  let!(:pending_entitlement) { FactoryBot.create :pending_entitlement, email: email }

  let!(:user) { pending_entitlement && FactoryBot.create(:user, email: email) }

  it "enqueues a job for each matching row" do
    expect do
      described_class.perform_now user
    end.to have_enqueued_job(Entitlements::CreatePendingJob).with(pending_entitlement).once
  end

  it "gets enqueued when a user reconfirms their email" do
    expect do
      user.mark_email_confirmed!
    end.to have_enqueued_job(described_class).with(user).once
  end

  it "gets enqueued when a new user confirms their email" do
    expect do
      new_user = FactoryBot.create :user

      new_user.mark_email_confirmed!
    end.to have_enqueued_job(described_class).once
  end
end
