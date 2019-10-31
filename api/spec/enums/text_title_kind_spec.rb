require "rails_helper"

RSpec.describe TextTitleKind, type: :enum do
  describe TextTitleKind::Main do
    it { is_expected.to be_a_main }
  end

  describe TextTitleKind::Acronym do
    it { is_expected.to be_an_acronym }
  end

  describe TextTitleKind::Abbreviated do
    it { is_expected.to be_abbreviated }
  end

  describe TextTitleKind::Alternative do
    it { is_expected.to be_alternative }
  end

  describe TextTitleKind::AlternativeCover do
    it { is_expected.to be_alternative_cover }
  end

  describe TextTitleKind::AlternativeBack do
    it { is_expected.to be_alternative_back }
  end

  describe TextTitleKind::Expanded do
    it { is_expected.to be_expanded }
  end

  describe TextTitleKind::Former do
    it { is_expected.to be_former }
  end

  describe TextTitleKind::Translated do
    it { is_expected.to be_translated }
  end

  describe TextTitleKind::Subtitle do
    it { is_expected.to be_a_subtitle }
  end

  describe TextTitleKind::Short do
    it { is_expected.to be_short }
  end

  describe TextTitleKind::Collection do
    it { is_expected.to be_a_collection }
  end

  describe TextTitleKind::Edition do
    it { is_expected.to be_an_edition }
  end
end
