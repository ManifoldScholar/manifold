require "rails_helper"

RSpec.describe ExportKind, packaging: true, type: :enum do
  subject { described_class.new }

  describe ExportKind::Unknown do
    it { is_expected.not_to be_epub }
  end

  describe ExportKind::EpubV3 do
    it { is_expected.to be_epub }
  end
end
