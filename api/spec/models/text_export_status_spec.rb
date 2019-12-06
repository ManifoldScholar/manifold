require 'rails_helper'

RSpec.describe TextExportStatus, type: :model, packaging: true do
  let!(:text) { FactoryBot.create :text }
  let!(:text_export) { FactoryBot.create :text_export, :epub_v3, fingerprint: export_fingerprint, text: text }

  let(:export_fingerprint) { "12345678" }

  let!(:text_export_status) { described_class.by_text(text).by_text_export(text_export).first }

  subject { text_export_status }

  context "when the fingerprint matches" do
    let(:export_fingerprint) { text.fingerprint }

    it { is_expected.to be_current }
    it { is_expected.not_to be_stale }
  end

  context "when the fingerprint does not match" do
    let(:export_fingerprint) { SecureRandom.uuid }

    it { is_expected.not_to be_current }
    it { is_expected.to be_stale }
  end

  context "with a text marked to export" do
    let!(:text) { FactoryBot.create :text, :exports_as_epub_v3 }

    it { is_expected.to be_an_autoexport }
  end
end
