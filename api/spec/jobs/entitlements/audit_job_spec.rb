require 'rails_helper'

RSpec.describe Entitlements::AuditJob, type: :job do
  let(:perform_audit) { Container["entitlements.audit.perform"] }
  let(:result) { Dry::Monads.Success(true) }

  before do
    allow(perform_audit).to receive(:call).and_return result
  end

  context "on a success" do
    it "works fine" do
      expect do
        described_class.perform_now
      end.not_to raise_error
    end
  end

  context "on a failure" do
    let(:result) { Dry::Monads.Failure([:error, "Reason"]) }

    it "fails loudly" do
      expect do
        described_class.perform_now
      end.to raise_error /\AFailed Audit/
    end
  end
end
