# frozen_string_literal: true

RSpec.describe Projects::ReindexResourcesJob, type: :job do
  let_it_be(:project, refind: true) { FactoryBot.create :project }
  let_it_be(:resource, refind: true) { FactoryBot.create :resource, project: }

  before do
    PgSearch::Document.where(searchable: resource).first.destroy!
  end

  it "reindexes the project children" do
    expect do
      described_class.perform_now project
    end.to change(PgSearch::Document.where(searchable: resource), :count).by(1)
  end
end
