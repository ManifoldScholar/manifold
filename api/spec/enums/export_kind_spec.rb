require "rails_helper"

RSpec.describe ExportKind, packaging: true, type: :enum do
  let(:enum) do
    described_class.new.tap do |enum|
      enum.owner = owner
    end
  end

  subject { enum }

  let(:owner) { nil }

  describe ExportKind::EpubV3 do
    it { is_expected.to be_epub }

    context "with an invalid model as an owner" do
      let(:owner) { FactoryBot.build :user }

      it { is_expected.to be_invalid }
    end

    context "with a text export as an owner" do
      let(:owner) { FactoryBot.build :text_export, :epub_v3 }

      it { is_expected.to be_valid }
    end
  end

  describe ExportKind::Unknown do
    it { is_expected.not_to be_epub }
  end
end
