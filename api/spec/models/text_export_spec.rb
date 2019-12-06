require 'rails_helper'

RSpec.describe TextExport, type: :model, packaging: true do
  describe ".prunable" do
    let(:the_scope) { described_class.prunable }

    let!(:text) { FactoryBot.create :text }
    let!(:prunable_export) do
      Timecop.freeze(TextExportStatus::PRUNABLE_AGE.ago - 1.day) do
        FactoryBot.create :text_export, :epub_v3, text: text
      end
    end
    let!(:stale_export) { FactoryBot.create :text_export, :epub_v3, text: text }
    let!(:current_export) { FactoryBot.create :text_export, :epub_v3, text: text, fingerprint: text.fingerprint }

    it "finds the correct exports" do
      aggregate_failures "scope works correctly" do
        expect(the_scope).to include prunable_export
        expect(the_scope).not_to include stale_export
        expect(the_scope).not_to include current_export
      end
    end
  end
end
