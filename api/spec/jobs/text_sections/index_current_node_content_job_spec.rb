# frozen_string_literal: true

RSpec.describe TextSections::IndexCurrentNodeContentJob, type: :job do
  let_it_be(:text_section, refind: true) { FactoryBot.create :text_section, :with_simple_body }

  let_it_be(:expected_count) { TextSectionNode.where(search_indexed: true).count }

  before do
    TextSectionNode.update_all(search_indexed: false)
  end

  it "updates search indices" do
    expect do
      described_class.perform_now(text_section)
    end.to change(TextSectionNode.sans_search_indexed, :count).by(-expected_count)
  end
end
