# frozen_string_literal: true

RSpec.describe TextSections::MaintainAllCurrentNodesJob, type: :job do
  let_it_be(:text_section, refind: true) { FactoryBot.create(:text_section, :with_simple_body) }

  before do
    text_section.index_nodes!

    TextSectionNode.where(text_section:).update_all(current: false)
  end

  it "maintains current nodes for all text sections" do
    expect do
      described_class.perform_now
    end.to change(TextSectionNode.current, :count)
      .and execute_safely
  end
end
