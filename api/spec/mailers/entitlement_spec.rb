# frozen_string_literal: true

RSpec.describe EntitlementMailer, type: :mailer do
  describe "created" do
    let!(:user) { FactoryBot.create :user }
    let!(:entitlement) { FactoryBot.create :entitlement, :global_subscriber, target: user }

    let(:mail) { EntitlementMailer.created user, entitlement }

    it "renders the headers" do
      expect(mail.subject).to match /access granted/i
      expect(mail.to).to eq([user.email])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match(/granted access/i)
    end
  end

  describe "pending" do
    let!(:pending_entitlement) { FactoryBot.create :pending_entitlement }
    let(:mail) { EntitlementMailer.pending pending_entitlement }

    it "renders the headers" do
      expect(mail.subject).to match /pending/
      expect(mail.to).to eq([pending_entitlement.email])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match(/granted pending access/i)
    end
  end
end
