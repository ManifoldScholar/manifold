# frozen_string_literal: true

RSpec.describe Entitlements::AuditJob, type: :job do
  let(:stubbed_operation) do
    double(ManifoldApi::Container["entitlements.audit.perform"])
  end

  let(:result) { Dry::Monads.Success(true) }

  around do |example|
    RSpec::Mocks.with_temporary_scope do
      allow(stubbed_operation).to receive(:call).and_return result

      ManifoldApi::Container.stub "entitlements.audit.perform", stubbed_operation do
        example.run
      end
    ensure
      ManifoldApi::Container.unstub "entitlements.audit.perform"
    end
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
