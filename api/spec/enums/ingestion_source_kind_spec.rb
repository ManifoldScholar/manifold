require "rails_helper"

RSpec.describe IngestionSourceKind, type: :enum do
  subject { described_class.new }

  describe IngestionSourceKind::PublicationResource do
    it { is_expected.to be_a_publication_resource }
  end

  describe IngestionSourceKind::Navigation do
    it { is_expected.to be_navigation }
  end

  describe IngestionSourceKind::Section do
    it { is_expected.to be_a_section }
  end

  describe IngestionSourceKind::CoverImage do
    it { is_expected.to be_a_cover_image }
  end
end
