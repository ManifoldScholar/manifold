# frozen_string_literal: true

RSpec.describe Attachments::RegenerateDerivativesJob, type: :job do
  let_it_be(:project, refind: true) do
    perform_enqueued_jobs do
      FactoryBot.create(:project, :with_cover)
    end.reload
  end

  context "when the attachment has missing derivatives" do
    before do
      project.cover_attacher.set_derivatives({}) # remove derivatives to simulate missing ones
      project.cover_attacher.delete_derivatives
      project.cover_attacher.atomic_persist
    end

    it "regenerates the derivatives" do
      expect do
        described_class.perform_now(project, :cover)
      end.to change { project.cover_attacher.derivatives.keys.size }.from(0).to be > 0
    end
  end
end
