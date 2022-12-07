# frozen_string_literal: true

require "rails_helper"

RSpec.describe EntitlementImports::GenerateAndProcessFake, type: :operation do
  let(:operation) { described_class.new }

  let!(:users) { FactoryBot.create_list :user, 10 }

  let!(:project) { FactoryBot.create :project }

  it "will create a mix of immediate and pending entitlements" do
    expect do
      @import = operation.call.value!
    end.to change(EntitlementImport, :count).by(1)
      .and(change(EntitlementImportRow, :count).by(20))
      .and(change(Entitlement, :count).by(10))
      .and(change(PendingEntitlement, :count).by(10))
      .and(have_enqueued_mail(EntitlementMailer, :created).exactly(10).times)
      .and(have_enqueued_mail(EntitlementMailer, :pending).exactly(10).times)

    expect(@import).to be_in_state(:success)
  end
end
