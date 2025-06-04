# frozen_string_literal: true

RSpec.describe Projects::ReindexChildrenJob, type: :job do
  let_it_be(:project, refind: true) { FactoryBot.create :project }

  it "enqueues jobs for each type of project child" do
    expect do
      described_class.perform_now project
    end.to have_enqueued_job(Projects::ReindexResourcesJob).once.with(project)
      .and have_enqueued_job(Projects::ReindexTextsJob).once.with(project)
      .and have_enqueued_job(Projects::ReindexTextSectionsJob).once.with(project)
  end
end
