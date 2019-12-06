require "rails_helper"

RSpec.describe TextExports::Prune, interaction: true, packaging: true do
  let!(:text) { FactoryBot.create :text }
  let!(:prunable_export) do
    Timecop.freeze(TextExportStatus::PRUNABLE_AGE.ago - 1.day) do
      FactoryBot.create :text_export, :epub_v3, text: text
    end
  end

  it "destroys the prunable exports" do
    perform_within_expectation! do |e|
      e.to change(TextExport, :count).by(-1)
    end
  end
end

