require "rails_helper"

RSpec.describe CachedExternalSource, packaging: true, type: :model do
  let!(:external_source) { FactoryBot.create :cached_external_source, *source_traits }

  let(:source_traits) { [] }

  subject { external_source }

  shared_examples_for "an unfetched external source" do
    it { is_expected.not_to be_needs_download }

    it { is_expected.not_to have_asset }

    its(:source_identifier) { is_expected.to start_with "EXT-" }
    its(:source_name) { is_expected.to include external_source.source_identifier }
    its(:source_path) { is_expected.to end_with external_source.source_name }
  end

  context "with an image" do
    let(:source_traits) { [:png_image] }

    its(:kind) { is_expected.to be_image }

    it_should_behave_like "an unfetched external source"
  end

  context "with a stylesheet" do
    let(:source_traits) { [:stylesheet] }

    its(:kind) { is_expected.to be_style }

    it_should_behave_like "an unfetched external source"
  end
end
