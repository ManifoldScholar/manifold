require "rails_helper"

RSpec.describe Texts::AutomateExports, interaction: true, packaging: true do
  let!(:text) { FactoryBot.create :text, :exports_as_epub_v3 }

  it "will enqueue a job for exportation" do
    perform_within_expectation! do |e|
      e.to have_enqueued_job(Packaging::Exportation::ExportTextToEpubV3Job).with(text)
    end
  end
end
