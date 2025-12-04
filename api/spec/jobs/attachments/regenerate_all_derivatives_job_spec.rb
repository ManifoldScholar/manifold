# frozen_string_literal: true

RSpec.describe Attachments::RegenerateAllDerivativesJob, type: :job do
  let_it_be(:project, refind: true) do
    perform_enqueued_jobs do
      FactoryBot.create(:project, :with_cover)
    end.reload
  end

  it "enqueues RegenerateDerivativesJob for each attachment" do
    expect do
      described_class.perform_now("Project")
    end.to have_enqueued_job(Attachments::RegenerateDerivativesJob).with(project, "cover").once
  end
end
