# frozen_string_literal: true

RSpec.describe Projects::ReindexTextSectionsJob, type: :job do
  let_it_be(:project, refind: true) { FactoryBot.create :project }
  let_it_be(:text, refind: true) { FactoryBot.create :text, project: }
  let_it_be(:text_section, refind: true) { FactoryBot.create :text_section, text: }

  before do
    PgSearch::Document.where(searchable: text_section).first.destroy!
  end

  it "reindexes the project children" do
    expect do
      described_class.perform_now project
    end.to change(PgSearch::Document.where(searchable: text_section), :count).by(1)
  end
end
