# frozen_string_literal: true

RSpec.describe Entitlements::CreateForRowJob, type: :job do
  let(:email) { Faker::Internet.email }
  let!(:entitlement_subject) { FactoryBot.create :project }
  let!(:target) { nil }

  let(:row_attrs) do
    {
      email: email,
      subject: entitlement_subject,
      target: target,
      expires_on: 1.year.from_now.to_date,
    }
  end

  let!(:entitlement_import_row) do
    FactoryBot.create(:entitlement_import_row, **row_attrs)
  end

  context "when a target is set" do
    let(:target) { FactoryBot.create :reading_group }

    it "creates an entitlement" do
      expect do
        described_class.perform_now entitlement_import_row
      end.to(
        change { entitlement_import_row.current_state(force_reload: true) }.from("pending").to("success")
        .and(change(Entitlement, :count).by(1))
      )
    end
  end

  context "when the email is pending" do
    it "creates a pending entitlement" do
      expect do
        described_class.perform_now entitlement_import_row
      end.to change { entitlement_import_row.current_state(force_reload: true) }.from("pending").to("success")
        .and(change(PendingEntitlement, :count).by(1))
        .and(keep_the_same(Entitlement, :count))
    end

    context "when a user exists with that email" do
      let!(:user) { FactoryBot.create :user, email: email }

      it "creates an entitlement for that user" do
        expect do
          described_class.perform_now entitlement_import_row
        end.to change { entitlement_import_row.current_state(force_reload: true) }.from("pending").to("success")
          .and(change { entitlement_import_row.reload.target_id }.to(user.id))
          .and(change(Entitlement, :count).by(1))
          .and(keep_the_same(PendingEntitlement, :count))
      end
    end
  end
end
