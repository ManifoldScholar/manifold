require "rails_helper"

RSpec.describe Packaging::Shared::ReferencedPath, packaging: true do
  let(:path) { "/some/path" }

  let(:referenced_path) { described_class.new path }

  subject { referenced_path }

  context "for an external URL" do
    let(:path) { Faker::Placeholdit.image }

    it { is_expected.not_to be_an_absolute_uri }
    it { is_expected.not_to have_ingestion_source }

    it { is_expected.to be_external }
    it { is_expected.not_to be_an_ingestion_source }
    it { is_expected.not_to be_a_text_section_link }

    its(:ingestion_source_id) { is_expected.to be_blank }
    its(:strategy) { is_expected.to be_external }
    its(:text_id) { is_expected.to be_blank }
    its(:text_section_id) { is_expected.to be_blank }
  end

  context "for an ingestion source" do
    let!(:ingestion_source) { FactoryBot.create :ingestion_source, :image }

    let(:ingestion_source_id) { ingestion_source.id }

    let(:path) { "/api/proxy/ingestion_sources/#{ingestion_source_id}" }

    it { is_expected.to be_an_absolute_uri }
    it { is_expected.to have_ingestion_source }
    it { is_expected.to be_an_ingestion_source }
    it { is_expected.not_to be_external }
    it { is_expected.not_to be_a_text_section_link }

    its(:derived_ingestion_source) { is_expected.to eq ingestion_source }
    its(:ingestion_source_id) { is_expected.to eq ingestion_source_id }
    its(:strategy) { is_expected.to be_an_ingestion_source }
    its(:text_id) { is_expected.to be_blank }
    its(:text_section_id) { is_expected.to be_blank }
  end

  context "for a legacy ingestion source" do
    let!(:ingestion_source) { FactoryBot.create :ingestion_source, :image }

    let(:attachment_id) { ingestion_source.attachment.id }

    let(:path) { "/system/#{attachment_id}" }

    it { is_expected.to be_an_absolute_uri }
    it { is_expected.to have_ingestion_source }
    it { is_expected.to be_a_legacy_ingestion_source }
    it { is_expected.not_to be_external }
    it { is_expected.not_to be_an_ingestion_source }
    it { is_expected.not_to be_a_text_section_link }

    its(:attachment_id) { is_expected.to eq attachment_id }
    its(:derived_ingestion_source) { is_expected.to eq ingestion_source }
    its(:ingestion_source_id) { is_expected.to be_blank }
    its(:strategy) { is_expected.to be_a_legacy_ingestion_source }
    its(:text_id) { is_expected.to be_blank }
    its(:text_section_id) { is_expected.to be_blank }
  end

  context "for a text section link" do
    let(:text_id) { SecureRandom.uuid }
    let(:text_section_id) { SecureRandom.uuid }

    let(:path) { "/read/#{text_id}/section/#{text_section_id}" }

    it { is_expected.to be_an_absolute_uri }
    it { is_expected.not_to have_ingestion_source }
    it { is_expected.to be_a_text_section_link }

    its(:ingestion_source_id) { is_expected.to be_blank }
    its(:strategy) { is_expected.to be_a_text_section_link }
    its(:text_id) { is_expected.to eq text_id }
    its(:text_section_id) { is_expected.to eq text_section_id }
  end

  context "for something unknown" do
    let(:path) { "/anything/else" }

    it { is_expected.to be_an_absolute_uri }
    it { is_expected.not_to have_ingestion_source }

    it { is_expected.not_to be_external }
    it { is_expected.not_to be_an_ingestion_source }
    it { is_expected.not_to be_a_text_section_link }

    its(:ingestion_source_id) { is_expected.to be_blank }
    its(:strategy) { is_expected.to be_unknown }
    its(:text_id) { is_expected.to be_blank }
    its(:text_section_id) { is_expected.to be_blank }
  end
end
