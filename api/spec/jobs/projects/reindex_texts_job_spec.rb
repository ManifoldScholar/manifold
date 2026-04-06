# frozen_string_literal: true

RSpec.describe Projects::ReindexTextsJob, type: :job do
  let_it_be(:project, refind: true) { FactoryBot.create :project }
  let_it_be(:text, refind: true) { FactoryBot.create :text, project: }

  before do
    PgSearch::Document.where(searchable: text).first.destroy!
  end

  it "reindexes the project children" do
    expect do
      described_class.perform_now project
    end.to change(PgSearch::Document.where(searchable: text), :count).by(1)
  end
end
