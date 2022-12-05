# frozen_string_literal: true

require "rails_helper"

RSpec.describe Entitlements::CreateFromUserJob, type: :job do
  let!(:email) { Faker::Internet.unique.safe_email }

  let!(:user) { FactoryBot.create :user, email: email }

  let!(:entitlement_import_row) { FactoryBot.create :entitlement_import_row, email: email }

  it "enqueues a job for each matching row" do
    expect do
      described_class.perform_now user
    end.to have_enqueued_job(Entitlements::CreateForRowJob).with(entitlement_import_row).once
  end

  it "gets enqueued when a user changes their email" do
    expect do
      user.email = Faker::Internet.unique.safe_email

      user.save!
    end.to have_enqueued_job(described_class).with(user).once
  end

  it "gets enqueued when a new user is created" do
    expect do
      FactoryBot.create :user
    end.to have_enqueued_job(described_class).once
  end
end
