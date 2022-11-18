require 'rails_helper'

RSpec.describe TextSectionAggregation, type: :model do
    let!(:text) { FactoryBot.create :text }

    let!(:section_1) { FactoryBot.create :text_section, text: text, position: 1, name: "One" }
    let!(:section_2) { FactoryBot.create :text_section, text: text, position: 2, name: "Two" }
    let!(:section_3) { FactoryBot.create :text_section, text: text, position: 3, name: "Three" }

    let!(:instance) { described_class.find_by text_id: text.id }

  describe "#auto_generated_toc" do
    it "corresponds to the expected shape" do
      expect(instance.auto_generated_toc).to include_unordered_json [{id: section_1.id, label: "One"}, {id: section_2.id, label: "Two"}, {id: section_3.id, label: "Three"}]
    end
  end
end
