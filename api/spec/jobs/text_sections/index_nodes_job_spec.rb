# frozen_string_literal: true

RSpec.describe TextSections::IndexNodesJob, type: :job do
  let!(:text_section) { FactoryBot.create :text_section, :with_simple_body }

  it "runs the operation" do
    expect do
      described_class.perform_now text_section
    end.to change(TextSectionNode, :count).by_at_least(1)
  end
end
