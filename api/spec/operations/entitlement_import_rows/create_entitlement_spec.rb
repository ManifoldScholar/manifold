# frozen_string_literal: true

require "rails_helper"

RSpec.describe EntitlementImportRows::CreateEntitlement, type: :operation do
  let(:operation) { described_class.new }

  context "when producing a pending entitlement" do
    let!(:project) { FactoryBot.create :project }
    let!(:entitlement_import_row) { FactoryBot.create :entitlement_import_row, subject: project }

    it "produces a pending entitlement with the right shape" do
      expect do
        expect(operation.(entitlement_import_row)).to monad_fail.with_key(:no_target_yet)
      end.to change { entitlement_import_row.current_state(force_reload: true) }.from("pending").to("success")
        .and(change(PendingEntitlement, :count).by(1))
        .and(keep_the_same(Entitlement, :count))

      entitlement_import_row.reload

      pending_entitlement = entitlement_import_row.pending_entitlement

      expect(pending_entitlement.current_state(force_reload: true)).to eq "pending"

      expect(pending_entitlement).to have_attributes(
        entitlement_import_row.slice(:subject, :expiration, :first_name, :last_name, :email)
      )
    end
  end
end
